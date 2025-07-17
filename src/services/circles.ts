import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore'
import { db } from './firebase'
import { Circle, User, Player } from '../types'

export const createCircle = async (
  name: string, 
  description: string, 
  ownerId: string, 
  maxMembers: number = 10
): Promise<{ success: boolean; circleId?: string; error?: string }> => {
  try {
    const inviteCode = generateInviteCode()
    
    const circleData: Omit<Circle, 'id'> = {
      name,
      description,
      ownerId,
      members: [ownerId],
      maxMembers,
      inviteCode,
      isPrivate: true,
      createdAt: new Date(),
      settings: {
        battleInterval: 30,
        allowForging: true,
        allowTrades: true
      }
    }

    const docRef = await addDoc(collection(db, 'circles'), circleData)
    
    // Add circle to user's circles array
    await updateDoc(doc(db, 'users', ownerId), {
      circles: arrayUnion(docRef.id)
    })

    // Create player record
    const playerData: Omit<Player, 'userId'> = {
      circleId: docRef.id,
      role: 'offense',
      level: 1,
      experience: 0,
      loadout: {},
      stats: {
        attack: 10,
        defense: 10,
        health: 100,
        speed: 10,
        critRate: 0.05,
        critDamage: 1.5
      },
      joinedAt: new Date(),
      isOnline: true
    }

    await addDoc(collection(db, 'players'), {
      userId: ownerId,
      ...playerData
    })

    return { success: true, circleId: docRef.id }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export const joinCircle = async (
  inviteCode: string, 
  userId: string
): Promise<{ success: boolean; circleId?: string; error?: string }> => {
  try {
    const circlesQuery = query(
      collection(db, 'circles'),
      where('inviteCode', '==', inviteCode)
    )
    
    const circleSnapshot = await getDocs(circlesQuery)
    
    if (circleSnapshot.empty) {
      return { success: false, error: 'Invalid invite code' }
    }

    const circleDoc = circleSnapshot.docs[0]
    const circle = circleDoc.data() as Circle
    
    if (circle.members.includes(userId)) {
      return { success: false, error: 'Already a member of this circle' }
    }
    
    if (circle.members.length >= circle.maxMembers) {
      return { success: false, error: 'Circle is full' }
    }

    // Add user to circle
    await updateDoc(doc(db, 'circles', circleDoc.id), {
      members: arrayUnion(userId)
    })

    // Add circle to user's circles array
    await updateDoc(doc(db, 'users', userId), {
      circles: arrayUnion(circleDoc.id)
    })

    // Create player record
    const playerData: Omit<Player, 'userId'> = {
      circleId: circleDoc.id,
      role: 'offense',
      level: 1,
      experience: 0,
      loadout: {},
      stats: {
        attack: 10,
        defense: 10,
        health: 100,
        speed: 10,
        critRate: 0.05,
        critDamage: 1.5
      },
      joinedAt: new Date(),
      isOnline: true
    }

    await addDoc(collection(db, 'players'), {
      userId,
      ...playerData
    })

    return { success: true, circleId: circleDoc.id }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export const leaveCircle = async (
  circleId: string, 
  userId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const circleRef = doc(db, 'circles', circleId)
    const circleDoc = await getDoc(circleRef)
    
    if (!circleDoc.exists()) {
      return { success: false, error: 'Circle not found' }
    }

    const circle = circleDoc.data() as Circle
    
    if (circle.ownerId === userId) {
      // If owner is leaving, transfer ownership or delete circle
      if (circle.members.length > 1) {
        const newOwner = circle.members.find(id => id !== userId)
        await updateDoc(circleRef, {
          ownerId: newOwner,
          members: arrayRemove(userId)
        })
      } else {
        // Delete circle if owner is the only member
        await deleteDoc(circleRef)
      }
    } else {
      // Remove user from circle
      await updateDoc(circleRef, {
        members: arrayRemove(userId)
      })
    }

    // Remove circle from user's circles array
    await updateDoc(doc(db, 'users', userId), {
      circles: arrayRemove(circleId)
    })

    // Remove player record
    const playersQuery = query(
      collection(db, 'players'),
      where('userId', '==', userId),
      where('circleId', '==', circleId)
    )
    
    const playerSnapshot = await getDocs(playersQuery)
    if (!playerSnapshot.empty) {
      await deleteDoc(playerSnapshot.docs[0].ref)
    }

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export const getUserCircles = async (userId: string): Promise<Circle[]> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId))
    if (!userDoc.exists()) return []
    
    const user = userDoc.data() as User
    const circles: Circle[] = []
    
    for (const circleId of user.circles) {
      const circleDoc = await getDoc(doc(db, 'circles', circleId))
      if (circleDoc.exists()) {
        circles.push({ id: circleDoc.id, ...circleDoc.data() } as Circle)
      }
    }
    
    return circles
  } catch (error) {
    console.error('Error fetching user circles:', error)
    return []
  }
}

export const getCircleMembers = async (circleId: string): Promise<User[]> => {
  try {
    const circleDoc = await getDoc(doc(db, 'circles', circleId))
    if (!circleDoc.exists()) return []
    
    const circle = circleDoc.data() as Circle
    const members: User[] = []
    
    for (const userId of circle.members) {
      const userDoc = await getDoc(doc(db, 'users', userId))
      if (userDoc.exists()) {
        members.push({ id: userDoc.id, ...userDoc.data() } as User)
      }
    }
    
    return members
  } catch (error) {
    console.error('Error fetching circle members:', error)
    return []
  }
}

export const updateCircleSettings = async (
  circleId: string, 
  settings: Partial<Circle['settings']>
): Promise<{ success: boolean; error?: string }> => {
  try {
    await updateDoc(doc(db, 'circles', circleId), {
      settings: { ...settings }
    })
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

const generateInviteCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}