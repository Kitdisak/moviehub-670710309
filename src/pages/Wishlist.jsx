import { useEffect, useState } from 'react';
import MovieGrid from '../components/MovieGrid';
import { useAuth } from '../auth/AuthContext';
import { getWishlist } from '../api/backend';

// หน้า "รายการที่อยากดู" ของสมาชิกที่ login อยู่
function Wishlist() {
  const { member, token } = useAuth();

  const [movies, setMovies] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadWishlist() {
      try {
        setStatus('loading');
        setError(null);

        const list = await getWishlist(token);

        // API คืนข้อมูลเป็น { items }
        setMovies(list.items || []);

        setStatus('success');
      } catch (err) {
        console.error(err);

        setError(
          err.message || 'ไม่สามารถโหลดรายการที่อยากดูได้'
        );

        setStatus('error');
      }
    }

    if (token) {
      loadWishlist();
    }
  }, [token]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">

      <h1 className="text-2xl font-semibold text-slate-900">
        รายการที่อยากดูของ {member?.displayName}
      </h1>

      <p className="mb-6 text-sm text-slate-500">
        กดปุ่มหัวใจในหน้าหนังเพื่อเพิ่มเรื่องเข้ามาที่นี่
      </p>

      <MovieGrid
        movies={movies}
        status={status}
        error={error}
      />

    </div>
  );
}

export default Wishlist;