import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import {
  putVote,
  addToWishlist,
  removeFromWishlist
} from '../api/backend';

// แถบปุ่มใต้ชื่อหนัง
function MovieActions({ movieId }) {
  const { isLoggedIn, token } = useAuth();
  const navigate = useNavigate();

  const [myScore, setMyScore] = useState(null);
  const [inWishlist, setInWishlist] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // ถ้ายังไม่ได้ Login
  if (!isLoggedIn) {
    return (
      <p className="mt-4 text-sm text-slate-500">
        <Link
          to="/login"
          className="text-emerald-600 hover:underline"
        >
          เข้าสู่ระบบ
        </Link>{' '}
        เพื่อให้คะแนนและเพิ่มเข้ารายการที่อยากดู
      </p>
    );
  }

  // ==============================
  // ให้คะแนนหนัง
  // ==============================
  async function handleVote(score) {
    try {
      setMessage(null);

      await putVote(movieId, score, token);

      setMyScore(score);
      setMessage(`ให้คะแนน ${score}/10 เรียบร้อยแล้ว`);
    } catch (err) {
      setMessage(
        err.message || 'ไม่สามารถบันทึกคะแนนได้'
      );
    }
  }

  // ==============================
  // เพิ่ม / ลบ Wishlist
  // ==============================
  async function handleWishlist() {
    try {
      setLoading(true);
      setMessage(null);

      // ถ้ามีหนังเรื่องนี้อยู่ใน Wishlist แล้ว
      if (inWishlist) {
        await removeFromWishlist(movieId, token);

        setInWishlist(false);
        setMessage('นำออกจากรายการที่อยากดูแล้ว');

        return;
      }

      // ถ้ายังไม่มี -> เพิ่มเข้า Wishlist
      await addToWishlist(movieId, token);

      // เปลี่ยนปุ่มเป็นสีเขียว
      setInWishlist(true);

      // แสดงข้อความสั้น ๆ
      setMessage('เพิ่มเข้ารายการที่อยากดูแล้ว');

      // รอ 0.4 วินาที เพื่อให้เห็นปุ่มเปลี่ยนสีก่อน
      setTimeout(() => {
        navigate('/me/wishlist');
      }, 400);

    } catch (err) {
      setMessage(
        err.message || 'ไม่สามารถเพิ่มรายการที่อยากดูได้'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4 space-y-3">

      {/* ==============================
          ส่วนให้คะแนน
          ============================== */}
      <div className="flex flex-wrap items-center gap-1">

        <span className="mr-2 text-sm text-slate-500">
          ให้คะแนน
        </span>

        {Array.from(
          { length: 10 },
          (_, i) => i + 1
        ).map(n => (

          <button
            key={n}
            onClick={() => handleVote(n)}
            className={
              'h-8 w-8 rounded-lg border text-sm transition ' +
              (
                myScore === n
                  ? 'border-emerald-500 bg-emerald-500 text-white'
                  : 'border-emerald-200 bg-white text-slate-600 hover:bg-emerald-50'
              )
            }
          >
            {n}
          </button>

        ))}

      </div>

      {/* ==============================
          ปุ่มรายการที่อยากดู
          ============================== */}
      <button
        onClick={handleWishlist}
        disabled={loading}
        className={
          'rounded-lg border px-4 py-2 text-sm transition duration-200 ' +
          (
            inWishlist
              ? 'border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700'
              : 'border-emerald-200 bg-white text-slate-600 hover:bg-emerald-50'
          ) +
          (
            loading
              ? ' cursor-not-allowed opacity-60'
              : ''
          )
        }
      >

        {loading
          ? 'กำลังบันทึก...'
          : inWishlist
            ? '❤️ อยู่ในรายการที่อยากดูแล้ว'
            : '🤍 เพิ่มเข้ารายการที่อยากดู'
        }

      </button>

      {/* ==============================
          ข้อความแจ้งเตือน
          ============================== */}
      {message && (
        <p className="text-sm text-slate-500">
          {message}
        </p>
      )}

    </div>
  );
}

export default MovieActions;