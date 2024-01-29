import { RefObject, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Delete, Edit, Play } from '@/assets'
import { Button } from '@/common/ui/button'
import { Pagination } from '@/common/ui/pagination'
import { DoubleSlider } from '@/common/ui/slider'
import { TabSwitcher, TabType } from '@/common/ui/tabSwitcher'
import { Table, TableBody, TableDataCell, TableRow } from '@/common/ui/table/tableConstuctor'
import { TableHeader } from '@/common/ui/table/tableHeader/tableHeader'
import TextField from '@/common/ui/textField/textField'
import { Typography } from '@/common/ui/typography'
import { CreateNewDeck } from '@/features/deck/createNewDeck/createNewDeck'
import { useDeckFilter } from '@/pages/decs/deckFIlter'
import { clsx } from 'clsx'

import s from './decks.module.scss'

const columns = [
  { key: 'name', sortable: true, title: 'Name' },
  {
    key: 'cardsCount',
    sortable: true,
    title: 'CardsCount',
  },
  { key: 'updated', sortable: true, title: 'Last Updated' },
  { key: 'author.name', sortable: true, title: 'Created by' },
  {
    key: '',
    sortable: true,
    title: '',
  },
]

const Decks = () => {
  const {
    clearFilter,
    currentPage,
    data,
    deckError,
    deckIsLoading,
    deleteDeck,
    getCurrentTab,
    isDeckBeingDeleted,
    itemsPerPage,
    maxCards,
    me,
    meIsLoading,
    minCards,
    minMaxValues,
    onChangeCurrentPage,
    onChangeName,
    onChangeSliderValues,
    onTabValueChange,
    orderBy,
    searchBy,
    setItemsPerPage,
    setSortedBy,
  } = useDeckFilter()
  const navigate = useNavigate()
  const divAnchor: RefObject<HTMLDivElement> = useRef(null)
  const defaultPaginationValue = 10
  const [isOpen, setIsOpen] = useState(false)
  const onCreateDeck = () => {
    setIsOpen(true)
  }

  if (deckIsLoading && meIsLoading) {
    return <div>Loading</div>
  }
  if (deckError) {
    return <div>{JSON.stringify(deckError)}</div>
  }

  const tabs: TabType[] = [
    { title: 'My Cards', value: 'userCards' },
    { title: 'All Cards', value: 'allCards' },
  ]
  const classNames = {
    icon: clsx(s.icon, isDeckBeingDeleted && s.disableIcon),
  }

  const openDeckHandler = (id: string) => {
    navigate(`/cards/${id}`)
  }

  return (
    <div className={s.deckWrapper}>
      <CreateNewDeck isOpen={isOpen} onOpenChange={setIsOpen} title={'Add New Deck'} />
      <div className={s.deckHead}>
        <Typography variant={'h1'}>Decks List</Typography>
        <Button onClick={onCreateDeck}>Add New Deck</Button>
      </div>
      <div className={s.deckFilter}>
        <div>
          <TextField
            label={'Search'}
            onValueChange={onChangeName}
            placeholder={'Input search'}
            value={searchBy}
            variant={'search'}
          />
        </div>
        <TabSwitcher
          defaultValue={getCurrentTab || tabs[0].value}
          label={'Show decks cards'}
          onValueChange={onTabValueChange}
          tabs={tabs}
        />
        <div>
          <Typography className={s.sliderLabel} variant={'body2'}>
            Number of cards
          </Typography>
          <DoubleSlider
            changeSliderValue={onChangeSliderValues}
            defaultValue={[minCards, maxCards]}
            max={minMaxValues?.max}
            min={minMaxValues?.min}
          />
        </div>
        <Button
          icon={<Delete className={s.deleteIcon} />}
          onClick={clearFilter}
          variant={'secondary'}
        >
          Clear Filter
        </Button>
      </div>
      <Table>
        <TableHeader columns={columns} onSort={setSortedBy} sort={orderBy} />
        <TableBody>
          {data?.items?.map(deck => {
            return (
              <TableRow key={deck.id}>
                <TableDataCell>
                  <Button
                    className={s.tableDataContent}
                    onClick={() => openDeckHandler(deck.id)}
                    variant={'link'}
                  >
                    {deck.cover && <img alt={'image'} className={s.tableImage} src={deck.cover} />}
                    {deck.name}
                  </Button>
                </TableDataCell>
                <TableDataCell>{deck.cardsCount}</TableDataCell>
                <TableDataCell>{new Date(deck.updated).toLocaleDateString('ru-RU')}</TableDataCell>
                <TableDataCell>{deck.author.name}</TableDataCell>
                <TableDataCell className={s.iconRow}>
                  {me?.id === deck.userId ? (
                    <>
                      <Edit className={s.icon} />
                      <Play className={s.icon} />
                      <Delete
                        className={classNames.icon}
                        onClick={() => {
                          deleteDeck({ id: deck.id })
                        }}
                      />
                    </>
                  ) : (
                    <Play className={s.icon} />
                  )}
                </TableDataCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      <Pagination
        changeCurrentPage={onChangeCurrentPage}
        changeItemsPerPage={setItemsPerPage}
        className={s.paginationBlock}
        currentPage={currentPage}
        pageSize={itemsPerPage}
        totalCount={data?.pagination.totalItems ?? defaultPaginationValue}
      />
      <div ref={divAnchor} />
    </div>
  )
}

export default Decks
