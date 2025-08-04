# Student Authentication Protection

Энэ систем нь student-dashboard болон бусад хамгаалагдсан хуудсуудыг зөвхөн нэвтэрсэн сурагчдад харагдахаар болгосон.

## Хэрхэн ажилладаг

### 1. StudentAuthGuard Component

`StudentAuthGuard` нь хамгаалагдсан хуудсыг бүрхэж, зөвхөн нэвтэрсэн сурагчдад харагдана:

```tsx
import StudentAuthGuard from "../../components/StudentAuthGuard";

const ProtectedPage = () => {
  return (
    <StudentAuthGuard>
      <div>Энэ зөвхөн нэвтэрсэн сурагчдад харагдана</div>
    </StudentAuthGuard>
  );
};
```

### 2. Authentication Check

Систем нь localStorage-д дараах утгуудыг шалгана:

- `studentToken` - Сурагчийн токен
- `studentUser` - Сурагчийн мэдээлэл (JSON string)

### 3. Хэрэв токен байхгүй бол

- Хэрэглэгчийг `/student-login` хуудас руу чиглүүлнэ
- Loading animation харуулна
- Хуудасны агуулгыг харуулахгүй

## Ашиглах аргууд

### Арга 1: StudentAuthGuard Component ашиглах (Санал болгож буй)

```tsx
import StudentAuthGuard from "../../components/StudentAuthGuard";

const MyProtectedPage = () => {
  return (
    <StudentAuthGuard>
      <div>Хамгаалагдсан агуулга</div>
    </StudentAuthGuard>
  );
};
```

### Арга 2: Utility function ашиглах

```tsx
import { requireStudentAuth } from "../../lib/utils";

const MyProtectedPage = () => {
  useEffect(() => {
    requireStudentAuth("/student-login");
  }, []);

  return <div>Хамгаалагдсан агуулга</div>;
};
```

### Арга 3: Hook ашиглах

```tsx
import { useStudentAuth } from "../../lib/auth";

const MyProtectedPage = () => {
  const { isAuthenticated, student, loading } = useStudentAuth();

  if (loading) return <div>Уншиж байна...</div>;
  if (!isAuthenticated) return null; // Redirect will happen

  return <div>Хамгаалагдсан агуулга</div>;
};
```

## Utility Functions

### checkStudentAuth()

Сурагчийн нэвтрэх эрхийг шалгана:

```tsx
import { checkStudentAuth } from "../../lib/utils";

const { isAuthenticated, student } = checkStudentAuth();
```

### clearStudentAuth()

Сурагчийн нэвтрэх эрхийг цэвэрлэнэ:

```tsx
import { clearStudentAuth } from "../../lib/utils";

const handleLogout = () => {
  clearStudentAuth();
  router.push("/student-login");
};
```

### requireStudentAuth(redirectTo)

Нэвтрэх эрх шаардлагатай бол redirect хийнэ:

```tsx
import { requireStudentAuth } from "../../lib/utils";

requireStudentAuth("/student-login");
```

## Жишээ

`/protected-example` хуудас руу орж үзээрэй. Энэ нь хамгаалагдсан хуудасны жишээ юм.

## Анхаарах зүйлс

1. **localStorage шалгах**: Систем нь `studentToken` болон `studentUser` утгуудыг шалгана
2. **JSON validation**: `studentUser` нь зөв JSON байх ёстой
3. **Automatic redirect**: Хэрэв токен байхгүй бол автоматаар login хуудас руу чиглүүлнэ
4. **Loading state**: Authentication шалгаж байх үед loading animation харуулна
5. **Event listeners**: localStorage өөрчлөгдөх үед автоматаар дахин шалгана

## Хэрэглээ

Энэ системийг ашигласнаар:

- Хамгаалагдсан хуудсуудыг хялбархан үүсгэх боломжтой
- Нэвтрэх эрхгүй хэрэглэгчдийг автоматаар хаах
- Кодын давталтыг багасгах
- Нэгдсэн authentication логик

## Засвар хийсэн файлууд

### 1. MentorCalendar.tsx

- `mentorToken`-г `studentToken` болгож өөрчилсөн
- Сурагчийн нэвтрэх эрхийг шалгах болгосон
- JSON validation нэмсэн

### 2. BookingModal.tsx

- NextAuth session-г ашиглахгүйгээр localStorage шалгах болгосон
- Сурагчийн токен шалгах болгосон
- Алдааны мессежийг монгол хэл дээр болгосон
- `/api/mark-availability`-г `/api/create-booking` болгож өөрчилсөн
- Сурагчийн захиалга үүсгэх болгосон

### 3. student-dashboard/page.tsx

- StudentAuthGuard ашиглан хамгаалах болгосон
- Нэвтрэх эрхгүй бол автоматаар login хуудас руу чиглүүлнэ

### 4. Шинээр нэмсэн файлууд

#### client/src/app/api/create-booking/route.ts

- Сурагчийн захиалга үүсгэх API route
- Server-тэй холбогдож booking үүсгэнэ

#### server/controller/create-booking.ts

- Захиалга үүсгэх controller
- Student болон Mentor байгаа эсэхийг шалгана
- Booking model ашиглан захиалга үүсгэнэ

#### server/router/student-router.ts

- `/bookings` POST route нэмсэн

## NextAuth Error Handling

### Алдааны төрлүүд

1. **CLIENT_FETCH_ERROR**: NextAuth session fetch алдаа
2. **Unexpected end of JSON input**: JSON parse алдаа
3. **Mixed authentication**: NextAuth болон localStorage холилдсон

### Шийдэл

#### 1. ErrorBoundary Component

- NextAuth алдааг catch хийнэ
- Алдааг console-д log хийнэ
- User-т алдааны UI харуулдаггүй

#### 2. SessionProvider Configuration

- `refetchInterval={0}` - Автомат refetch идэвхгүй
- `refetchOnWindowFocus={false}` - Window focus refetch идэвхгүй

#### 3. useAuthWithFallback Hook

- localStorage authentication-г priority болгосон
- NextAuth алдаа гарвал localStorage fallback
- Error handling нэмсэн

#### 4. Utility Functions

- `handleNextAuthError()` - NextAuth алдааг handle хийнэ
- `safeSessionCheck()` - Safe session check
