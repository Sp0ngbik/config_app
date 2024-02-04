import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/common/ui/button'
import { Card } from '@/common/ui/card'
import { TextFieldControlled } from '@/common/ui/controlled'
import { Typography } from '@/common/ui/typography'
import { FormValuesForgotPassword, forgotPasswordSchema } from '@/pages/auth/forgotPassword/utils'
import { usePasswordRecoveryMutation } from '@/services/auth/auth.sevice'
import { zodResolver } from '@hookform/resolvers/zod'

import s from './forgotPassword.module.scss'

export const ForgotPassword = () => {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<FormValuesForgotPassword>({
    defaultValues: { email: '' },
    resolver: zodResolver(forgotPasswordSchema),
  })
  const navigate = useNavigate()
  const [passwordRecovery] = usePasswordRecoveryMutation()
  const onSubmit = (data: FormValuesForgotPassword) => {
    const link =
      '<h1>Hi , ##name##</h1><p>Click <a href="https://flashcards-beige.vercel.app/recover-password/##token##">here</a> to recover your password</p>'

    passwordRecovery({ email: data.email, html: link })
    navigate('/check-email')
  }

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography className={s.signInLabel} variant={'large'}>
          Forgot your password?
        </Typography>
        <TextFieldControlled
          className={s.emailField}
          control={control}
          errorMessage={errors.email?.message}
          id={'email'}
          label={'Email'}
          name={'email'}
          placeholder={'example@gmail.com'}
        />
        <Typography as={'p'} className={s.enterEmail} variant={'body2'}>
          Enter your email address and we will send you further instructions
        </Typography>
        <Button fullWidth type={'submit'}>
          Send Instructions
        </Button>
      </form>
      <Typography className={s.formQuestion} variant={'body2'}>
        Did you remember your password?
      </Typography>
      <Button className={s.submitButton} variant={'link'}>
        Try logging in
      </Button>
    </Card>
  )
}
