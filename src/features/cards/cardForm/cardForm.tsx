import { RefObject, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/common/ui/button'
import { Modal } from '@/common/ui/modal'
import CardSection from '@/features/cards/createNewCard/cardSection/cardSection'
import {
  FormValuesAddCard,
  addCardSchema,
} from '@/features/cards/createNewCard/utils/addNewCardModalSchema'
import { zodResolver } from '@hookform/resolvers/zod'

import s from '@/features/cards/createNewCard/addNewCardModal.module.scss'

type AddNewDeckModalProps = {
  card?: EditCardType
  id?: string
  isLoading?: boolean
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSubmitCard: (data: FormData) => void
  title: string
}

export type EditCardType = {
  answer: string
  answerImg: string | undefined
  id?: string
  question: string
  questionImg: string | undefined
}

export const CardForm = ({
  card,
  isLoading,
  isOpen,
  onOpenChange,
  onSubmitCard,
  title,
}: AddNewDeckModalProps) => {
  const fileQuestionInputRef: RefObject<HTMLInputElement> = useRef(null)
  const fileAnswerInputRef: RefObject<HTMLInputElement> = useRef(null)

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<FormValuesAddCard>({
    defaultValues: { answer: '', question: '' },
    resolver: zodResolver(addCardSchema),
  })

  useEffect(() => {
    if (card) {
      setValue('answer', card.answer || '')
      setValue('question', card.question || '')

      // setCurrentAnswerPhoto(card.answerImg)
      // setCurrentQuestionPhoto(card.questionImg)
    }
  }, [card, setValue])

  // const [questionPhoto, setQuestionPhoto] = useState<File | null>(null)
  // const [answerPhoto, setAnswerPhoto] = useState<File | null>(null)
  const [currentAnswerPhoto, setCurrentAnswerPhoto] = useState<File | null>(null)
  const [currentQuestionPhoto, setCurrentQuestionPhoto] = useState<File | null>(null)
  const closeHandler = () => {
    onOpenChange(false)
  }

  const onSubmit = async (data: FormValuesAddCard) => {
    try {
      const formData = new FormData()

      formData.append('question', data.question)
      formData.append('answer', data.answer)

      if (currentAnswerPhoto) {
        formData.append('answerImg', currentAnswerPhoto)
      }
      // else {
      //   formData.append('answerImg', '')
      // }
      if (currentQuestionPhoto) {
        formData.append('questionImg', currentQuestionPhoto)
      }
      // else {
      //   formData.append('questionImg', '')
      // }

      onSubmitCard(formData)

      // setCurrentQuestionPhoto('')
      // setCurrentAnswerPhoto('')
      onOpenChange(false)
    } catch (error) {
      console.error('Error creating card:', error)
    }
  }

  const openQuestionFileInput = () => {
    if (fileQuestionInputRef.current) {
      fileQuestionInputRef.current.click()
    }
  }

  const openAnswerFileInput = () => {
    if (fileAnswerInputRef.current) {
      fileAnswerInputRef.current.click()
    }
  }

  // const uploadedQuestionImage = currentQuestionPhoto
  //   ? URL.createObjectURL(currentQuestionPhoto)
  //   : ''
  const questionImageValidator = () => {
    if (currentQuestionPhoto) {
      return URL.createObjectURL(currentQuestionPhoto)
    }
    if (card?.questionImg) {
      return card.questionImg
    }

    return ''
  }
  const answerImageValidator = () => {
    if (currentAnswerPhoto) {
      return URL.createObjectURL(currentAnswerPhoto)
    }
    if (card?.answerImg) {
      return card.answerImg
    }

    return ''
  }

  console.log(questionImageValidator())

  return (
    <>
      <Modal onOpenChange={onOpenChange} open={isOpen} title={title}>
        <form className={s.form} id={'hook-form'} onSubmit={handleSubmit(onSubmit)}>
          <CardSection
            control={control}
            errors={errors}
            fileInputRef={fileQuestionInputRef}
            label={'Question'}
            name={'question'}
            openFileInput={openQuestionFileInput}
            setCurrentPhoto={setCurrentQuestionPhoto}
            uploadedImage={questionImageValidator()}
          />
          <CardSection
            control={control}
            errors={errors}
            fileInputRef={fileAnswerInputRef}
            label={'Answer'}
            name={'answer'}
            openFileInput={openAnswerFileInput}
            setCurrentPhoto={setCurrentAnswerPhoto}
            uploadedImage={answerImageValidator()}
          />
          <div className={s.btnArea}>
            <Button disabled={isLoading} form={'hook-form'} type={'submit'} variant={'primary'}>
              {title}
            </Button>
            <Button onClick={closeHandler} type={'reset'} variant={'secondary'}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}
