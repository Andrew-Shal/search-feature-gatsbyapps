import React from 'react'
import { useState } from 'react'
import styled from 'styled-components'

const S = {
    SearchByButtons: styled.div`
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        padding-bottom: 20px;
    `,
    SearchByButton: styled.a`
        background: ${({ active }) => (active ? '#2e6a76' : '#76b9c6')};
        color: #fff;
        text-decoration: none;
        min-width: 80px;
        max-width: 100px;
        padding: 10px 15px;
        border-radius: 4px;
        margin: 5px 5px;
        text-align: center;
        :hover {
            background: ${({ active }) => (active ? '#2e6a76' : '#63a4b1')};
        }
    `,
}

const SearchByButtons = ({ selected, searchByTypes, onSearchByChange }) => {
    const handleSearchByBtnClick = (searchByType, event) => {
        event.preventDefault()
        onSearchByChange(searchByType)
    }

    return (
        <S.SearchByButtons>
            {searchByTypes.map((searchByType) => (
                <S.SearchByButton key={searchByType.id} active={selected.id === searchByType.id ? true : false} href="#" onClick={handleSearchByBtnClick.bind(this, searchByType)}>
                    {searchByType.label}
                </S.SearchByButton>
            ))}
        </S.SearchByButtons>
    )
}

export default SearchByButtons
