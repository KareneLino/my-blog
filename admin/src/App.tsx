import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { LoginPage } from './components/LoginPage';
import { Toaster } from './components/ui/Toaster';
import { AppProvider } from './context/AppContext';
import { AdminLayout } from './components/layout/AdminLayout';
import { Dashboard } from './pages/Dashboard';
import { ArticleList } from './pages/ArticleList';
import { ArticleEditor } from './pages/ArticleEditor';
import { CategoryList } from './pages/CategoryList';
import { CategoryDetail } from './pages/CategoryDetail';
import { TagList } from './pages/TagList';
import { UserList } from './pages/UserList';
import { Settings } from './pages/Settings';
import { ConfirmDialog } from './components/ui/ConfirmDialog';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="nexus-theme">
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            {/* 后台管理私有布局 */}
            <Route path="/" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="articles" element={<ArticleList />} />
              <Route path="articles/new" element={<ArticleEditor />} />
              <Route path="articles/edit/:id" element={<ArticleEditor />} />
              <Route path="categories" element={<CategoryList />} />
              <Route path="categories/:id" element={<CategoryDetail />} />
              <Route path="tags" element={<TagList />} />
              <Route path="users" element={<UserList />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
        <ConfirmDialog />
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
