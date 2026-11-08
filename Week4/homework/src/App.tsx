import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import AuthPage from './pages/AuthPage';
import PostsPage from './pages/PostsPage';
import PostDetailPage from './pages/PostDetailPage';
import CreatePostPage from './pages/CreatePostPage';
import EditPostPage from './pages/EditPostPage';

function App() {
  const location = useLocation();

  // 회원 코드 발급받는 페이지에서는 헤더 안보이게 하기
  const showHeader = location.pathname !== '/';

  return (
    <>
      {showHeader && <Header />}

      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/posts" element={<PostsPage />} />
        <Route path="/posts/:postId" element={<PostDetailPage />} />
        <Route path="/posts/new" element={<CreatePostPage />} />
        <Route path="/posts/:postId/edit" element={<EditPostPage />} />
      </Routes>
    </>
  );
}

export default App;