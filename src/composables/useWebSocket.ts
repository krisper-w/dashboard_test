import { ref, onUnmounted } from 'vue'

export function useWebSocket(url: string) {
  const messages = ref<string[]>([])
  const status = ref<'enter a request' | 'open' | 'closed'>('enter a request')

  const socket = new WebSocket(url)

  socket.onopen = () => {
    status.value = 'open'
  }
  socket.onclose = () => {
    status.value = 'closed'
  }
  socket.onerror = () => {
    status.value = 'closed'
  }

  socket.onmessage = (event: MessageEvent) => {
    messages.value.push(`Response: ${event.data}`)
  }

  const sendMessage = (text: string) => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(text)
      messages.value.push(`Sent: ${text}`)
    }
  }

  onUnmounted(() => socket.close())

  return { messages, status, sendMessage }
}
