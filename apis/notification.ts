import client from './client'

const API_URL = process.env.BACKEND_URL

class Notification {
  getNotifications() {
    return client.get(API_URL + 'v1/users/notifications').then(response => {
      return response?.data
    })
  }

  updateNotificationSettings(settings) {
    return client.put(API_URL + 'v1/users/notification_settings', settings).then(response => {
      return response?.data
    })
  }
}

export default new Notification()
