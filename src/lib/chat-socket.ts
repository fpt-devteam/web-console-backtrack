import { io, type Socket } from 'socket.io-client';
import { auth } from './firebase';

const SOCKET_URL = import.meta.env.VITE_API_URL as string;
const SOCKET_PATH = '/chat/hub';

let socket: Socket | null = null;

/**
 * Get (or lazily create) the Socket.io singleton connected to the Chat service
 * via the API Gateway at path /chat/hub.
 *
 * Auth: Firebase ID token is passed in three ways to maximise gateway compat:
 *   - auth.token  (Socket.io handshake)
 *   - Authorization Bearer header
 *   - access_token query param
 */
export async function getChatSocket(): Promise<Socket> {
  if (socket?.connected) return socket;

  const user = auth.currentUser;
  const token = user ? await user.getIdToken() : '';

  if (socket) {
    // Socket exists but disconnected — update auth and reconnect
    socket.auth = { token };
    socket.connect();
    return socket;
  }

  socket = io(SOCKET_URL, {
    path: SOCKET_PATH,
    auth: { token },
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
    query: { access_token: token },
    transports: ['polling', 'websocket'],
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  return socket;
}

/**
 * Return the existing socket instance without creating a new one.
 * Returns null if the socket has not been initialised yet.
 */
export function getExistingSocket(): Socket | null {
  return socket;
}

/**
 * Disconnect and destroy the socket singleton.
 * Call this on user logout.
 */
export function destroyChatSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
