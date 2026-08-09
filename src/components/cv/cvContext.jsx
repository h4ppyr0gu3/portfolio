import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  emptyContact,
  emptyDocument,
  emptyItem,
  emptySection,
  moveInArray,
  normalizeDocument,
  seedFromSiteCv,
  uid,
} from './cvModel.js';
import { clearLocal, readFromLocation, writeLocal } from './cvStorage.js';

const CvContext = createContext(null);

export function CvProvider({ children, siteCv }) {
  const [doc, setDocState] = useState(() =>
    typeof window !== 'undefined' ? readFromLocation(siteCv) : emptyDocument()
  );
  const [ready] = useState(() => typeof window !== 'undefined');
  const [status, setStatus] = useState('');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Avoid persisting the SSR placeholder before client state is real.
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeLocal(doc);
  }, [doc, hydrated]);

  const setDoc = useCallback((next) => {
    setDocState((prev) => {
      const value = typeof next === 'function' ? next(prev) : next;
      return normalizeDocument(value);
    });
  }, []);

  const flash = useCallback((msg) => {
    setStatus(msg);
    window.clearTimeout(flash._t);
    flash._t = window.setTimeout(() => setStatus(''), 3200);
  }, []);

  const loadExample = useCallback(() => {
    setDoc(seedFromSiteCv(siteCv));
    flash('Loaded example CV — edit anything; it saves in this browser.');
  }, [flash, setDoc, siteCv]);

  const startBlank = useCallback(() => {
    setDoc(emptyDocument());
    flash('Started a blank CV.');
  }, [flash, setDoc]);

  const resetAll = useCallback(() => {
    clearLocal();
    setDoc(seedFromSiteCv(siteCv));
    flash('Reset to example CV.');
  }, [flash, setDoc, siteCv]);

  const updateMeta = useCallback(
    (patch) => {
      setDoc((d) => ({
        ...d,
        meta: { ...d.meta, ...patch, isExample: false },
      }));
    },
    [setDoc]
  );

  const updateContact = useCallback(
    (id, patch) => {
      setDoc((d) => ({
        ...d,
        meta: {
          ...d.meta,
          isExample: false,
          contact: d.meta.contact.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        },
      }));
    },
    [setDoc]
  );

  const addContact = useCallback(() => {
    setDoc((d) => ({
      ...d,
      meta: {
        ...d.meta,
        isExample: false,
        contact: [...d.meta.contact, emptyContact()],
      },
    }));
  }, [setDoc]);

  const removeContact = useCallback(
    (id) => {
      setDoc((d) => ({
        ...d,
        meta: {
          ...d.meta,
          isExample: false,
          contact: d.meta.contact.filter((c) => c.id !== id),
        },
      }));
    },
    [setDoc]
  );

  const addSection = useCallback(
    (type = 'custom', title = 'New section') => {
      setDoc((d) => ({
        ...d,
        meta: { ...d.meta, isExample: false },
        sections: [...d.sections, emptySection(type, title)],
      }));
    },
    [setDoc]
  );

  const updateSection = useCallback(
    (sectionId, patch) => {
      setDoc((d) => ({
        ...d,
        meta: { ...d.meta, isExample: false },
        sections: d.sections.map((s) => (s.id === sectionId ? { ...s, ...patch } : s)),
      }));
    },
    [setDoc]
  );

  const removeSection = useCallback(
    (sectionId) => {
      setDoc((d) => ({
        ...d,
        meta: { ...d.meta, isExample: false },
        sections: d.sections.filter((s) => s.id !== sectionId),
      }));
    },
    [setDoc]
  );

  const moveSection = useCallback(
    (sectionId, dir) => {
      setDoc((d) => {
        const idx = d.sections.findIndex((s) => s.id === sectionId);
        if (idx < 0) return d;
        return {
          ...d,
          meta: { ...d.meta, isExample: false },
          sections: moveInArray(d.sections, idx, idx + dir),
        };
      });
    },
    [setDoc]
  );

  const addItem = useCallback(
    (sectionId, item) => {
      setDoc((d) => ({
        ...d,
        meta: { ...d.meta, isExample: false },
        sections: d.sections.map((s) =>
          s.id === sectionId
            ? { ...s, items: [...s.items, { ...emptyItem(), ...item, id: uid('item') }] }
            : s
        ),
      }));
    },
    [setDoc]
  );

  const updateItem = useCallback(
    (sectionId, itemId, patch) => {
      setDoc((d) => ({
        ...d,
        meta: { ...d.meta, isExample: false },
        sections: d.sections.map((s) =>
          s.id === sectionId
            ? {
                ...s,
                items: s.items.map((it) => (it.id === itemId ? { ...it, ...patch } : it)),
              }
            : s
        ),
      }));
    },
    [setDoc]
  );

  const removeItem = useCallback(
    (sectionId, itemId) => {
      setDoc((d) => ({
        ...d,
        meta: { ...d.meta, isExample: false },
        sections: d.sections.map((s) =>
          s.id === sectionId ? { ...s, items: s.items.filter((it) => it.id !== itemId) } : s
        ),
      }));
    },
    [setDoc]
  );

  const moveItem = useCallback(
    (sectionId, itemId, dir) => {
      setDoc((d) => ({
        ...d,
        meta: { ...d.meta, isExample: false },
        sections: d.sections.map((s) => {
          if (s.id !== sectionId) return s;
          const idx = s.items.findIndex((it) => it.id === itemId);
          if (idx < 0) return s;
          return { ...s, items: moveInArray(s.items, idx, idx + dir) };
        }),
      }));
    },
    [setDoc]
  );

  const value = useMemo(
    () => ({
      doc,
      ready,
      status,
      flash,
      setDoc,
      siteCv,
      loadExample,
      startBlank,
      resetAll,
      updateMeta,
      updateContact,
      addContact,
      removeContact,
      addSection,
      updateSection,
      removeSection,
      moveSection,
      addItem,
      updateItem,
      removeItem,
      moveItem,
    }),
    [
      doc,
      ready,
      status,
      flash,
      setDoc,
      siteCv,
      loadExample,
      startBlank,
      resetAll,
      updateMeta,
      updateContact,
      addContact,
      removeContact,
      addSection,
      updateSection,
      removeSection,
      moveSection,
      addItem,
      updateItem,
      removeItem,
      moveItem,
    ]
  );

  return <CvContext.Provider value={value}>{children}</CvContext.Provider>;
}

export function useCv() {
  const ctx = useContext(CvContext);
  if (!ctx) throw new Error('useCv must be used within CvProvider');
  return ctx;
}
