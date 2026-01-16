import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export const baseURL = `${import.meta.env.VITE_API_BASE_URL}`

const LoginPage = () => {
  const GOOGLE_CLIENT_ID = `${import.meta.env.VITE_GOOGLE_CLIENT_ID}`
  const navigate = useNavigate()

  const handleLogin = async (googleResp) => {
    const SERVER_URL = `${baseURL}/auth/login`
    try {
      // 구글에서 받아온 정보 해독
      const decoded = jwtDecode(googleResp.credential)
      console.log('해독된 정보: ', decoded)

      // 서버로 보낼 데이터
      const userData = {
        email: decoded['email'],
        nickname: decoded['name'],
        googleId: decoded.sub,
      }

      // 서버로 데이터 전송
      const serverResp = await axios.post(SERVER_URL, userData)

      // 유저 정보 localStorage에 저장
      console.log('서버 응답:', serverResp.data)
      localStorage.setItem('user', JSON.stringify(serverResp.data.user))

      // isNewUser 확인
      if (serverResp.data.isNewUser) {
        // 신규 유저
        navigate('/tutorial')
      } else {
        // 기존 유저
        navigate('/lobby')
      }
    } catch (error) {
      console.error('로그인 실패', error)
      alert('로그인 실패')
    }
  }
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
        <GoogleLogin
          onSuccess={handleLogin}
          onError={() => {
            console.log('Login Failed')
          }}
        />
      </div>
    </GoogleOAuthProvider>
  )
}

export default LoginPage
