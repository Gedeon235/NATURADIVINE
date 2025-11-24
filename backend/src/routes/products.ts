import express from 'express';
const router = express.Router();

// Routes produits
router.get('/', (req: express.Request, res: express.Response) => {
  res.json({
    success: true,
    message: 'Liste des produits - ROUTE MODULE',
    data: [
      { id: 1, name: 'Crème hydratante', price: 29.99 },
      { id: 2, name: 'Sérum anti-âge', price: 49.99 }
    ]
  });
});

router.get('/:id', (req: express.Request, res: express.Response) => {
  res.json({
    success: true,
    message: `Détail produit ${req.params.id} - ROUTE MODULE`,
    data: { id: req.params.id, name: 'Produit Module', price: 29.99 }
  });
});

// EXPORT CORRECT pour TypeScript + CommonJS
export = router; // ← CHANGEMENT IMPORTANT ICI