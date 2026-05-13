/**
 * Hook re-export para useAvatarShop
 * Caminho: hooks/useAvatarShop.tsx
 *
 * Re-exporta tudo do contexto para manter
 * o padrão de imports do projeto (hooks/useAuth, hooks/useChat, etc.)
 */
export { useAvatarShop, AvatarShopProvider, AVATARS } from '../context/AvatarShopContext';
export type { AvatarItem } from '../context/AvatarShopContext';