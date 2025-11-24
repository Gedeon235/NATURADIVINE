import express from 'express';
const router = express.Router();

// Routes services
router.get('/', (req: express.Request, res: express.Response) => {
  res.json({
    success: true,
    message: 'Liste des services - ROUTE MODULE',
    data: [
      { id: 1, name: 'Soin du visage', price: 50, duration: 60 },
      { id: 2, name: 'Massage relaxant', price: 70, duration: 90 }
    ]
  });
});

router.get('/:id', (req: express.Request, res: express.Response) => {
  res.json({
    success: true,
    message: `Détail service ${req.params.id} - ROUTE MODULE`,
    data: { id: req.params.id, name: 'Service Module', price: 50 }
  });
});

router.get('/:id/beauticians', (req: express.Request, res: express.Response) => {
  res.json({
    success: true,
    message: `Esthéticiennes pour service ${req.params.id} - ROUTE MODULE`,
    data: [
      { id: 1, name: 'Marie Dupont', specialty: 'Soins visage' },
      { id: 2, name: 'Sophie Martin', specialty: 'Massages' }
    ]
  });
});

// EXPORT CORRECT pour TypeScript + CommonJS
export = router; // ← CHANGEMENT IMPORTANT ICI