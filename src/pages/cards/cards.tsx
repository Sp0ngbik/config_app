import { useMemo } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { ArrowBack } from '@/assets/icons/arrow-back-outline'
import { Button } from '@/common/ui/button'
import { Grade } from '@/common/ui/grade/grade'
import { Pagination } from '@/common/ui/pagination'
import { Sort } from '@/common/ui/table/table.stories'
import { Table, TableBody, TableDataCell, TableRow } from '@/common/ui/table/tableConstuctor'
import { TableHeader } from '@/common/ui/table/tableHeader/tableHeader'
import TextField from '@/common/ui/textField/textField'
import { Typography } from '@/common/ui/typography'
import { useGetCardsQuery } from '@/services/cards/cards.service'
import { useGetDeckByIdQuery } from '@/services/decks/decks.service.'

import s from './cards.module.scss'

const columns = [
  { key: 'question', title: 'Question' },
  { key: 'answer', title: 'Answer' },
  { key: 'updated', title: 'Last Updated' },
  { key: 'grade', title: 'Grade' },
]

export const Cards = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [search, setSearch] = useSearchParams()

  const backToDeckHandler = () => {
    navigate('/cards', { relative: 'path' })
  }

  const changeSearchHandler = (field: string, params: string) => {
    if (!params) {
      search.delete(field)
    } else {
      search.set(field, params)
    }
    search.set('page', '1')
    setSearch(search)
  }
  const onChangeCurrentPage = (value: number) => {
    changeSearchHandler('currentPage', value.toString())
  }
  const setItemsPerPage = (value: number) => {
    changeSearchHandler('itemsPerPage', value.toString())
  }
  const orderBy = JSON.parse(search.get('orderBy') || '""')
  const sortedString = useMemo(() => {
    if (!orderBy) {
      return null
    }

    return `${orderBy.key}-${orderBy.direction}`
  }, [orderBy])
  const setSortedBy = (value: Sort) => {
    if (!value || value?.key) {
      changeSearchHandler('orderBy', JSON.stringify(value))
    }
  }

  const currentPage = Number(search.get('currentPage') || 1)
  const itemsPerPage = Number(search.get('itemsPerPage') || '4')
  const { data: getCardsData } = useGetCardsQuery({
    currentPage,
    id,
    itemsPerPage,
    orderBy: sortedString,
  })
  const { data: getCardByIdData } = useGetDeckByIdQuery({ id })

  return (
    <div className={s.cardWrapper}>
      <Button
        className={s.backToDeck}
        icon={<ArrowBack className={s.arrowBack} />}
        onClick={backToDeckHandler}
        variant={'link'}
      >
        Back to Decks List
      </Button>
      <div className={s.cardsHeader}>
        <div>
          <Typography variant={'h1'}>{getCardByIdData?.name}</Typography>
          <img alt={'tableImage nf'} className={s.tableImage} src={getCardByIdData?.cover} />
        </div>
        <Button variant={'primary'}>Learn to Pack</Button>
      </div>
      <TextField label={'Search'} placeholder={'Input search'} variant={'search'} />
      {getCardsData?.items.length ? (
        <>
          <Table>
            <TableHeader columns={columns} onSort={setSortedBy} sort={orderBy} />
            <TableBody>
              {getCardsData?.items?.map(card => {
                return (
                  <TableRow key={card.id}>
                    <TableDataCell>
                      <span className={s.tableDataContent}>
                        {card.questionImg && (
                          <img alt={'image'} className={s.tableImage} src={card.questionImg} />
                        )}
                        {card.question}
                      </span>
                    </TableDataCell>
                    <TableDataCell>
                      <span className={s.tableDataContent}>
                        {card.answerImg && (
                          <img alt={'image'} className={s.tableImage} src={card.answerImg} />
                        )}
                        {card.answer}
                      </span>
                    </TableDataCell>
                    <TableDataCell>
                      {new Date(card.created).toLocaleDateString('ru-RU')}
                    </TableDataCell>
                    <TableDataCell>
                      <Grade count={card.grade} />
                    </TableDataCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          <Pagination
            changeCurrentPage={onChangeCurrentPage}
            changeItemsPerPage={setItemsPerPage}
            currentPage={currentPage}
            pageSize={itemsPerPage}
            totalCount={getCardsData.pagination.totalItems || 4}
          />
        </>
      ) : (
        <Typography className={s.emptyTypography} variant={'large'}>
          This pack is empty.
        </Typography>
      )}
    </div>
  )
}
