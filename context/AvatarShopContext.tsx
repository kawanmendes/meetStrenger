/**
 * 🛍️ AVATAR SHOP CONTEXT — MeetStranger Mobile
 *
 * Caminho: context/AvatarShopContext.tsx
 *
 * CORREÇÃO CRÍTICA:
 * buyAvatar usava useCallback com [state.coins, state.purchasedIds]
 * como dependências. Quando chamado dentro do Alert.alert (assíncrono),
 * o closure já estava stale — lia valores velhos e retornava 'insufficient'
 * mesmo com saldo suficiente.
 *
 * Solução: useRef para manter referência sempre atualizada do state,
 * garantindo que buyAvatar leia o valor mais recente em qualquer momento.
 */

import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { appImages } from '../constants/assets';

// ==============================
// TIPOS
// ==============================

export interface AvatarItem {
  id: string;
  name: string;
  price: number;
  image: ReturnType<typeof require>;
}

interface ShopState {
  coins: number;
  purchasedIds: string[];
  equippedId: string;
}

interface AvatarShopContextType {
  coins: number;
  purchasedIds: string[];
  equippedId: string;
  equippedAvatar: AvatarItem;
  avatars: AvatarItem[];
  isLoaded: boolean;
  buyAvatar: (avatar: AvatarItem) => 'ok' | 'insufficient' | 'already_owned';
  equipAvatar: (id: string) => void;
}

// ==============================
// CATÁLOGO DE AVATARES
// ==============================

export const AVATARS: AvatarItem[] = [
  { id: '1', name: 'Mystical',  price: 0,   image: appImages.perfil1 },
  { id: '2', name: 'Shadow',    price: 80,  image: appImages.perfil2 },
  { id: '3', name: 'Aurora',    price: 120, image: appImages.perfil3 },
  { id: '4', name: 'Eclipse',   price: 150, image: appImages.perfil4 },
  { id: '5', name: 'Solaris',   price: 200, image: appImages.perfil5 },
  { id: '6', name: 'Nebula',    price: 250, image: appImages.perfil6 },
  { id: '7', name: 'Phantom',   price: 300, image: appImages.perfil7 },
  { id: '8', name: 'Celestia',  price: 350, image: appImages.perfil8 },
  { id: '9', name: 'Legendary', price: 500, image: appImages.perfil9 },
];

const DEFAULT_AVATAR = AVATARS[0];
const STORAGE_KEY = '@meetstranger:avatar_shop';

const INITIAL_STATE: ShopState = {
  coins: 500,
  purchasedIds: ['1'],
  equippedId: '1',
};

// ==============================
// CONTEXT
// ==============================

const AvatarShopContext = createContext<AvatarShopContextType | undefined>(undefined);

// ==============================
// PROVIDER
// ==============================

export function AvatarShopProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ShopState>(INITIAL_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  // ✅ Ref sempre atualizada com o state mais recente.
  // Evita stale closure em callbacks assíncronos (Alert, setTimeout, etc.)
  const stateRef = useRef<ShopState>(INITIAL_STATE);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // --- Carrega do AsyncStorage na montagem ---
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed: ShopState = JSON.parse(raw);
          // Garante que o avatar grátis sempre está desbloqueado
          if (!parsed.purchasedIds.includes('1')) {
            parsed.purchasedIds = ['1', ...parsed.purchasedIds];
          }
          setState(parsed);
          stateRef.current = parsed;
        }
      } catch (e) {
        console.warn('[AvatarShop] Erro ao carregar estado:', e);
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);

  // --- Persiste no AsyncStorage a cada mudança ---
  useEffect(() => {
    if (!isLoaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch((e) =>
      console.warn('[AvatarShop] Erro ao salvar estado:', e)
    );
  }, [state, isLoaded]);

  // ✅ buyAvatar lê SEMPRE do stateRef.current (valor vivo),
  // nunca de um closure antigo — resolve o bug de compra.
  const buyAvatar = useCallback(
    (avatar: AvatarItem): 'ok' | 'insufficient' | 'already_owned' => {
      const current = stateRef.current; // leitura sempre fresca

      if (current.purchasedIds.includes(avatar.id)) return 'already_owned';
      if (current.coins < avatar.price) return 'insufficient';

      setState((prev) => ({
        ...prev,
        coins: prev.coins - avatar.price,
        purchasedIds: [...prev.purchasedIds, avatar.id],
      }));
      return 'ok';
    },
    [] // sem dependências — stateRef nunca fica stale
  );

  // ✅ equipAvatar também usa setState funcional (sem dependência de state)
  const equipAvatar = useCallback((id: string) => {
    setState((prev) => ({ ...prev, equippedId: id }));
  }, []);

  // Avatar equipado resolvido
  const equippedAvatar = useMemo(
    () => AVATARS.find((a) => a.id === state.equippedId) ?? DEFAULT_AVATAR,
    [state.equippedId]
  );

  const value = useMemo<AvatarShopContextType>(
    () => ({
      coins: state.coins,
      purchasedIds: state.purchasedIds,
      equippedId: state.equippedId,
      equippedAvatar,
      avatars: AVATARS,
      isLoaded,
      buyAvatar,
      equipAvatar,
    }),
    [state, equippedAvatar, isLoaded, buyAvatar, equipAvatar]
  );

  return (
    <AvatarShopContext.Provider value={value}>
      {children}
    </AvatarShopContext.Provider>
  );
}

// ==============================
// HOOK
// ==============================

export function useAvatarShop(): AvatarShopContextType {
  const ctx = useContext(AvatarShopContext);
  if (!ctx) {
    throw new Error(
      'useAvatarShop deve ser usado dentro de <AvatarShopProvider>.\n' +
      'Adicione <AvatarShopProvider> em app/_layout.tsx.'
    );
  }
  return ctx;
}