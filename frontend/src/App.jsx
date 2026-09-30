import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DealerLayout from './dealer/components/DealerLayout';
import DealerDashboard from './dealer/pages/Dashboard';
import DealerLogin from './dealer/pages/DealerLogin';
import DealerProtectedRoute from './dealer/components/DealerProtectedRoute';
import { DealerAuthProvider } from './dealer/context/DealerAuthContext';
import DealerVehicles from './dealer/pages/Vehicles';
import DealerVehicleForm from './dealer/pages/VehicleForm';
import DealerParts from './dealer/pages/Parts';
import DealerPartForm from './dealer/pages/PartForm';
import DealerInventory from './dealer/pages/Inventory';
import DealerTestDrives from './dealer/pages/TestDrives';
import DealerServiceAppointments from './dealer/pages/ServiceAppointments';
import DealerOrders from './dealer/pages/Orders';
import DealerSales from './dealer/pages/Sales';
import DealerExpenses from './dealer/pages/Expenses';
import DealerProfitLoss from './dealer/pages/ProfitLoss';
import DealerCustomers from './dealer/pages/Customers';
import DealerReports from './dealer/pages/Reports';
import DealerProfile from './dealer/pages/Profile';
import PlaceholderModule from './dealer/components/PlaceholderModule';
import ShowroomHomepage from './components/ShowroomHomepage';
import Vehicles from './pages/vehicles/Vehicles';
import VehicleDetails from './pages/vehicles/VehicleDetails';
import Parts from './pages/parts/Parts';
import PartDetails from './pages/parts/PartDetails';
import Cart from './pages/cart/Cart';
import Wishlist from './pages/wishlist/Wishlist';
import Service from './pages/service/Service';
import ServiceBooking from './pages/service/ServiceBooking';
import Showroom from './pages/showroom/Showroom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/profile/Profile';
import Compare from './pages/compare/Compare';
import TestDrive from './pages/testdrive/TestDrive';
import Configurator from './pages/configurator/Configurator';
import Dealerships from './pages/dealerships/Dealerships';
import Financing from './pages/financing/Financing';
import Reviews from './pages/reviews/Reviews';
import Journal from './pages/journal/Journal';
import Orders from './pages/orders/Orders';
import Support from './pages/support/Support';
import Sell from './pages/sell/Sell';
import About from './pages/about/About';
import Privacy from './pages/legal/Privacy';
import Terms from './pages/legal/Terms';
import SearchPage from './pages/search/SearchPage';
import NotFound from './pages/NotFound';
import { WishlistProvider } from './context/WishlistContext';
import { CompareProvider } from './context/CompareContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

export default function App() {
  const [videoEnded, setVideoEnded] = useState(false);

  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <DealerAuthProvider>
            <WishlistProvider>
              <CompareProvider>
                <CartProvider>
                  <ErrorBoundary>
                    <Routes>
                  {/* ════════════════════════════════════════════════════
                      HOMEPAGE: Fixed 100vh cinematic scene.
                      Autoplay video -> 3D WebGL -> Glass Command Deck
                  ════════════════════════════════════════════════════ */}
                  <Route
                    path="/"
                    element={
                      <div
                        className="app-container select-none"
                        style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}
                      >
                        <ShowroomHomepage
                          onVideoEnd={() => setVideoEnded(true)}
                          onNavigateSection={() => {}}
                        />
                      </div>
                    }
                  />

                  {/* ════════════════════════════════════════════════════
                      PHASE 1: VEHICLES MODULE
                  ════════════════════════════════════════════════════ */}
                  <Route path="/vehicles" element={<Vehicles />} />
                  <Route path="/vehicles/:id" element={<VehicleDetails />} />

                  {/* ════════════════════════════════════════════════════
                      PHASE 2: PARTS & ACCESSORIES MODULE
                  ════════════════════════════════════════════════════ */}
                  <Route path="/parts" element={<Parts />} />
                  <Route path="/parts/:id" element={<PartDetails />} />

                  {/* ════════════════════════════════════════════════════
                      PHASE 3: CART MODULE
                  ════════════════════════════════════════════════════ */}
                  <Route path="/cart" element={<Cart />} />

                  {/* ════════════════════════════════════════════════════
                      PHASE 4: WISHLIST MODULE
                  ════════════════════════════════════════════════════ */}
                  <Route path="/wishlist" element={<Wishlist />} />

                  {/* ════════════════════════════════════════════════════
                      PHASE 5: SERVICE BOOKING MODULE
                  ════════════════════════════════════════════════════ */}
                  <Route path="/service" element={<Service />} />
                  <Route path="/service/book" element={<ServiceBooking />} />

                  {/* ════════════════════════════════════════════════════
                      PHASE 6: 360° DIGITAL SHOWROOM MODULE
                  ════════════════════════════════════════════════════ */}
                  <Route path="/showroom" element={<Showroom />} />

                  {/* ════════════════════════════════════════════════════
                      PHASE 7: AUTHENTICATION & ACCESS SUITE
                  ════════════════════════════════════════════════════ */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/profile" element={<Profile />} />

                  {/* ════════════════════════════════════════════════════
                      PHASE 8: VEHICLE COMPARISON SUITE
                  ════════════════════════════════════════════════════ */}
                  <Route path="/compare" element={<Compare />} />

                  {/* ════════════════════════════════════════════════════
                      PHASE 9: TEST DRIVE & CONCIERGE RESERVATION SUITE
                  ════════════════════════════════════════════════════ */}
                  <Route path="/test-drive" element={<TestDrive />} />

                  {/* ════════════════════════════════════════════════════
                      PHASE 10: 3D BESPOKE CONFIGURATOR STUDIO
                  ════════════════════════════════════════════════════ */}
                  <Route path="/configurator" element={<Configurator />} />
                  <Route path="/garage" element={<Configurator />} />

                  {/* ════════════════════════════════════════════════════
                      PHASE 11: GLOBAL ATELIER & STUDIO LOCATOR
                  ════════════════════════════════════════════════════ */}
                  <Route path="/dealerships" element={<Dealerships />} />

                  {/* ════════════════════════════════════════════════════
                      PHASE 12: LEASE & TREASURY FINANCE CALCULATOR
                  ════════════════════════════════════════════════════ */}
                  <Route path="/financing" element={<Financing />} />

                  {/* ════════════════════════════════════════════════════
                      PHASE 13: VERIFIED OWNER REVIEWS & TELEMETRY
                  ════════════════════════════════════════════════════ */}
                  <Route path="/reviews" element={<Reviews />} />

                  {/* ════════════════════════════════════════════════════
                      PHASE 14: TELEMETRY JOURNAL & MOTORSPORT DISPATCH
                  ════════════════════════════════════════════════════ */}
                  <Route path="/journal" element={<Journal />} />

                  {/* ════════════════════════════════════════════════════
                      PHASE 15: LIVE ALLOCATION & ORDER TRACKER
                  ════════════════════════════════════════════════════ */}
                  <Route path="/orders" element={<Orders />} />

                  {/* ════════════════════════════════════════════════════
                      PHASE 16: FAQ & CONCIERGE ASSISTANCE
                  ════════════════════════════════════════════════════ */}
                  <Route path="/support" element={<Support />} />

                  {/* ════════════════════════════════════════════════════
                      PHASE 17: SELL & TRADE-IN VALUATION DESK
                  ════════════════════════════════════════════════════ */}
                  <Route path="/sell" element={<Sell />} />

                  {/* ════════════════════════════════════════════════════
                      PHASE 18: CORPORATE HERITAGE & LEADERSHIP
                  ════════════════════════════════════════════════════ */}
                  <Route path="/about" element={<About />} />

                  {/* ════════════════════════════════════════════════════
                      PHASE 19: PRIVACY & LEGAL ACCORDS
                  ════════════════════════════════════════════════════ */}
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />

                  {/* ════════════════════════════════════════════════════
                      PHASE 20: UNIFIED OMNIBAR & UNIVERSAL SEARCH
                  ════════════════════════════════════════════════════ */}
                  <Route path="/search" element={<SearchPage />} />

                  {/* ════════════════════════════════════════════════════
                      CARCRAFT DEALER SUITE - PRIVATE ATELIER (PHASE 2)
                  ════════════════════════════════════════════════════ */}
                  {/* Dealer Public Gateway */}
                  <Route path="/dealer/login" element={<DealerLogin />} />
                  <Route path="/dealer" element={<Navigate to="/dealer/dashboard" replace />} />

                  {/* Dealer Protected Enclave */}
                  <Route
                    path="/dealer/dashboard"
                    element={
                      <DealerProtectedRoute>
                        <DealerLayout>
                          <DealerDashboard />
                        </DealerLayout>
                      </DealerProtectedRoute>
                    }
                  />
                  {/* Phase 3: Vehicle Management */}
                  <Route
                    path="/dealer/vehicles"
                    element={
                      <DealerProtectedRoute>
                        <DealerLayout>
                          <DealerVehicles />
                        </DealerLayout>
                      </DealerProtectedRoute>
                    }
                  />
                  <Route
                    path="/dealer/vehicles/add"
                    element={
                      <DealerProtectedRoute>
                        <DealerLayout>
                          <DealerVehicleForm mode="add" />
                        </DealerLayout>
                      </DealerProtectedRoute>
                    }
                  />
                  <Route
                    path="/dealer/vehicles/:id/edit"
                    element={
                      <DealerProtectedRoute>
                        <DealerLayout>
                          <DealerVehicleForm mode="edit" />
                        </DealerLayout>
                      </DealerProtectedRoute>
                    }
                  />
                  {/* Phase 4: Parts Management */}
                  <Route
                    path="/dealer/parts"
                    element={
                      <DealerProtectedRoute>
                        <DealerLayout>
                          <DealerParts />
                        </DealerLayout>
                      </DealerProtectedRoute>
                    }
                  />
                  <Route
                    path="/dealer/parts/add"
                    element={
                      <DealerProtectedRoute>
                        <DealerLayout>
                          <DealerPartForm mode="add" />
                        </DealerLayout>
                      </DealerProtectedRoute>
                    }
                  />
                  <Route
                    path="/dealer/parts/:id/edit"
                    element={
                      <DealerProtectedRoute>
                        <DealerLayout>
                          <DealerPartForm mode="edit" />
                        </DealerLayout>
                      </DealerProtectedRoute>
                    }
                  />
                  {/* Phase 5: Inventory */}
                  <Route
                    path="/dealer/inventory"
                    element={
                      <DealerProtectedRoute>
                        <DealerLayout>
                          <DealerInventory />
                        </DealerLayout>
                      </DealerProtectedRoute>
                    }
                  />

                  {/* Phase 6: Test Drives */}
                  <Route
                    path="/dealer/test-drives"
                    element={
                      <DealerProtectedRoute>
                        <DealerLayout>
                          <DealerTestDrives />
                        </DealerLayout>
                      </DealerProtectedRoute>
                    }
                  />

                  {/* Phase 7: Service Appointments */}
                  <Route
                    path="/dealer/service-appointments"
                    element={
                      <DealerProtectedRoute>
                        <DealerLayout>
                          <DealerServiceAppointments />
                        </DealerLayout>
                      </DealerProtectedRoute>
                    }
                  />

                  {/* Phase 8: Client Orders */}
                  <Route
                    path="/dealer/orders"
                    element={
                      <DealerProtectedRoute>
                        <DealerLayout>
                          <DealerOrders />
                        </DealerLayout>
                      </DealerProtectedRoute>
                    }
                  />

                  {/* Phase 9: Sales Ledger */}
                  <Route
                    path="/dealer/sales"
                    element={
                      <DealerProtectedRoute>
                        <DealerLayout>
                          <DealerSales />
                        </DealerLayout>
                      </DealerProtectedRoute>
                    }
                  />

                  {/* Phase 10: Operational Expenses */}
                  <Route
                    path="/dealer/expenses"
                    element={
                      <DealerProtectedRoute>
                        <DealerLayout>
                          <DealerExpenses />
                        </DealerLayout>
                      </DealerProtectedRoute>
                    }
                  />

                  {/* Phase 11: Profit & Loss Statement */}
                  <Route
                    path="/dealer/profit-loss"
                    element={
                      <DealerProtectedRoute>
                        <DealerLayout>
                          <DealerProfitLoss />
                        </DealerLayout>
                      </DealerProtectedRoute>
                    }
                  />

                  {/* Phase 12: Private Clientele */}
                  <Route
                    path="/dealer/customers"
                    element={
                      <DealerProtectedRoute>
                        <DealerLayout>
                          <DealerCustomers />
                        </DealerLayout>
                      </DealerProtectedRoute>
                    }
                  />

                  {/* Phase 13: Executive Reports */}
                  <Route
                    path="/dealer/reports"
                    element={
                      <DealerProtectedRoute>
                        <DealerLayout>
                          <DealerReports />
                        </DealerLayout>
                      </DealerProtectedRoute>
                    }
                  />

                  {/* Phase 14: Dealer Profile & Security */}
                  <Route
                    path="/dealer/profile"
                    element={
                      <DealerProtectedRoute>
                        <DealerLayout>
                          <DealerProfile />
                        </DealerLayout>
                      </DealerProtectedRoute>
                    }
                  />

                  {/* Fallback / 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </ErrorBoundary>
            </CartProvider>
            </CompareProvider>
          </WishlistProvider>
        </DealerAuthProvider>
      </AuthProvider>
    </ToastProvider>
  </BrowserRouter>
  );
}
