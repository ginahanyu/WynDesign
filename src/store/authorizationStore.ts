// 简单的授权用户存储
export interface AuthorizedUser {
  userId: string
  userName: string
}

// 使用简单的模块级状态存储
let authorizedUsers: AuthorizedUser[] = []
let listeners: (() => void)[] = []

export const authorizationStore = {
  getUsers: () => authorizedUsers,

  setUsers: (users: AuthorizedUser[]) => {
    authorizedUsers = users
    listeners.forEach(listener => listener())
  },

  addUser: (user: AuthorizedUser) => {
    if (!authorizedUsers.find(u => u.userId === user.userId)) {
      authorizedUsers = [...authorizedUsers, user]
      listeners.forEach(listener => listener())
    }
  },

  removeUser: (userId: string) => {
    authorizedUsers = authorizedUsers.filter(u => u.userId !== userId)
    listeners.forEach(listener => listener())
  },

  subscribe: (listener: () => void) => {
    listeners.push(listener)
    return () => {
      listeners = listeners.filter(l => l !== listener)
    }
  }
}
