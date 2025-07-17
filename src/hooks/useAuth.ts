import { useState, useEffect } from 'react'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '../services/firebase'
import { User } from '../types'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          console.log('Firebase user authenticated:', firebaseUser.uid)
          const userData = await getUserData(firebaseUser.uid)
          setUser(userData)
        } else {
          console.log('No Firebase user, setting user to null')
          setUser(null)
        }
      } catch (error) {
        console.error('Error in auth state change:', error)
        setUser(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const getUserData = async (userId: string): Promise<User | null> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId))
      if (userDoc.exists()) {
        const userData = userDoc.data()
        console.log('User data loaded:', userData)
        return { id: userId, ...userData } as User
      }
      console.log('User document does not exist for:', userId)
      return null
    } catch (error) {
      console.error('Error fetching user data:', error)
      return null
    }
  }

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password)
      
      const newUser: Omit<User, 'id'> = {
        email,
        displayName,
        level: 1,
        experience: 0,
        createdAt: new Date(),
        lastActive: new Date(),
        circles: []
      }

      await setDoc(doc(db, 'users', firebaseUser.uid), newUser)
      
      const userData = await getUserData(firebaseUser.uid)
      setUser(userData)
      
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      setUser(null)
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const updateLastActive = async () => {
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.id), {
          ...user,
          lastActive: new Date()
        })
      } catch (error) {
        console.error('Error updating last active:', error)
      }
    }
  }

  return {
    user,
    loading,
    signUp,
    signIn,
    logout,
    updateLastActive
  }
}