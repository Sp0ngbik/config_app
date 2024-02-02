import { useState } from 'react'

import { usePageFilter } from '@/pages/hooks/pageFilter'
import { useGetCardsQuery } from '@/services/cards/cards.service'
import { useDeleteDeckMutation, useGetDeckByIdQuery } from '@/services/decks/decks.service'


export const useCardFilter = (id: string | undefined) => {
  const {
    currentPage,
    debounceName,
    itemsPerPage,
    me,
    navigate,
    onChangeCurrentPage,
    onChangeName,
    orderBy,
    searchBy,
    setItemsPerPage,
    setSortedBy,
    sortedString,
  } = usePageFilter()
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenEdit, setIsOpenEdit] = useState(false)

  const { data: getCardsData } = useGetCardsQuery({
    currentPage,
    id,
    itemsPerPage,
    orderBy: sortedString,
    question: debounceName,
  })
  const { data: getCardByIdData } = useGetDeckByIdQuery({ id })

  const isOwner = me?.id === getCardByIdData?.userId
  const isEmpty = getCardByIdData?.cardsCount === 0

  return {
    currentPage,
    getCardByIdData,
    getCardsData,
    isEmpty,
    isOpen,
    isOpenEdit,
    isOwner,
    itemsPerPage,
    navigate,
    onChangeCurrentPage,
    onChangeName,
    orderBy,
    searchBy,
    setIsOpen,
    setIsOpenEdit,
    setItemsPerPage,
    setSortedBy,
  }
}
