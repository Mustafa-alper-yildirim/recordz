import { Router } from "express";
import authRoutes from "./auth.routes.js";
import usersRoutes from "./users.routes.js";
import cariRoutes from "./cari.routes.js";
import offersRoutes from "./offers.routes.js";
import ordersRoutes from "./orders.routes.js";
import movementsRoutes from "./movements.routes.js";
import productsRoutes from "./products.routes.js";
import stocksRoutes from "./stocks.routes.js";
import financeRoutes from "./finance.routes.js";
import personnelRoutes from "./personnel.routes.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", requireAuth, usersRoutes);
router.use("/cari", requireAuth, cariRoutes);
router.use("/offers", requireAuth, offersRoutes);
router.use("/orders", requireAuth, ordersRoutes);
router.use("/products", requireAuth, productsRoutes);
router.use("/stocks", requireAuth, requireRole("admin", "muhasebe"), stocksRoutes);
router.use("/finance", requireAuth, requireRole("admin", "muhasebe"), financeRoutes);
router.use("/personnel", requireAuth, requireRole("admin"), personnelRoutes);
router.use("/movements", requireAuth, requireRole("admin", "muhasebe"), movementsRoutes);

export default router;
