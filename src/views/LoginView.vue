<template>
  <main class="login-page">
    <div class="login-card">
      <h1 class="login-card__title">Register here</h1>
      <form @submit.prevent="onLogin" class="login-card__form">
        <input
          v-model="username"
          type="text"
          placeholder="Name"
          class="login-card__input"
          required
        />
        <div class="password-group">
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Password"
            class="login-card__input"
            required
          />
          <span class="password-toggle" @click="togglePassword">
            {{ showPassword ? '🙊' : '🙈' }}
          </span>
        </div>
        <button type="submit" class="login-card__button">Log in</button>
      </form>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const showPassword = ref(false)
const router = useRouter()

const togglePassword = () => (showPassword.value = !showPassword.value)

const onLogin = () => {
  if (username.value && password.value) {
    localStorage.setItem('isAuth', 'true')
    router.push('/dashboard')
  } else {
    alert('Fill in both fields')
  }
}
</script>

<style lang="scss" scoped>
@mixin checkerboard-bg {
  background-color: #f0f2f5;
  background-image:
    radial-gradient(circle, transparent 20%, #f0f2f5 93%),
    linear-gradient(45deg, rgba(0, 0, 0, 0.09) 25%, transparent 25%),
    linear-gradient(-45deg, rgba(0, 0, 0, 0.09) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, rgba(0, 0, 0, 0.09) 75%),
    linear-gradient(-45deg, transparent 75%, rgba(0, 0, 0, 0.09) 75%);
  background-size:
    100% 100%,
    100px 100px;
  background-position:
    center,
    0 0,
    0 50px,
    50px -50px,
    -50px 0px;
}

.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  @include checkerboard-bg;

  .login-card {
    background: #fff;
    width: 90%;
    max-width: 380px;
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(0, 0, 0, 0.05);

    &__title {
      margin-bottom: 2rem;
      text-align: center;
      font:
        800 1.5rem 'Inter',
        sans-serif;
    }

    &__form {
      display: flex;
      flex-direction: column;
      gap: 1.2rem;
    }

    &__input {
      width: 90%;
      padding: 14px;
      border: 1px solid #ddd;
      border-radius: 10px;
      transition: 0.3s;

      &:focus {
        outline: none;
        border-color: #42b883;
        box-shadow: 0 0 0 4px rgba(66, 184, 131, 0.1);
      }
    }

    .password-group {
      position: relative;
      display: flex;
      align-items: center;

      .password-toggle {
        position: absolute;
        right: 15px;
        cursor: pointer;
        font-size: 1.2rem;
        user-select: none;
      }
    }

    &__button {
      padding: 14px;
      background: #42b883;
      color: #fff;
      border: none;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      transition: 0.3s;

      &:hover {
        background: #3aa876;
        transform: translateY(-2px);
      }
    }
  }
}
</style>
