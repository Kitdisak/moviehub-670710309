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
    if (!token) return;

    async function loadWishlist() {
      try {
        setStatus('loading');
        setError(null);

        const data = await getWishlist(token);

        setMovies(data.items);
        setStatus('success');
      } catch (err) {
        setError(err);
        setStatus('error');
      }
    }

    loadWishlist();
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

// import MovieGrid from '../components/MovieGrid';
// import { useAuth } from '../auth/AuthContext';
// // TODO ขั้นที่ 4 (Lab): import { useEffect, useState } from 'react' และ import { getWishlist } from '../api/backend';

// // หน้า "รายการที่อยากดู" ของสมาชิกที่ login อยู่ (เส้นทาง /me/wishlist ครอบด้วย ProtectedRoute แล้ว)
// function Wishlist() {
//   const { member } = useAuth();                  // TODO ขั้นที่ 4 (Lab): ดึง token มาด้วย

//   // TODO ขั้นที่ 4 (Lab): เปลี่ยน 3 ค่าคงที่เป็น state แล้วโหลดด้วย useEffect
//   //   const list = await getWishlist(token)  ได้ { items } ที่เป็นรูปร่างเดียวกับการ์ดหนัง MovieGrid ใช้ได้เลย
//   //   dependency คือ [token]
//   const movies = [];
//   const status = 'success';
//   const error = null;

//   return (
//     <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
//       <h1 className="text-2xl font-semibold text-slate-900">รายการที่อยากดูของ {member?.displayName}</h1>
//       <p className="mb-6 text-sm text-slate-500">กดปุ่มหัวใจในหน้าหนังเพื่อเพิ่มเรื่องเข้ามาที่นี่</p>
//       <MovieGrid movies={movies} status={status} error={error} />
//     </div>
//   );
// }

// export default Wishlist;