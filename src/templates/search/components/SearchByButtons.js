import React from "react"
import styled from "styled-components"

const S = {
	SearchByButtons: styled.div`
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		padding-bottom: 20px;
	`,
	SearchByButton: styled.a`
		background: #e9d66c;
		color: #fff;
		text-decoration: none;
		min-width: 80px;
		max-width: 100px;
		padding: 10px 15px;
		border-radius: 4px;
		margin: 5px 5px;
		text-align: center;
		:hover {
			background: #caba5b;
		}
	`,
}

const SearchByButtons = ({ searchByTypes, onSearchByChange }) => {
	const handleSearchByBtnClick = (searchByType, event) => {
		event.preventDefault()
		onSearchByChange(searchByType)
	}

	return (
		<S.SearchByButtons>
			{searchByTypes.map((searchByType) => (
				<S.SearchByButton
					key={searchByType.id}
					href="#"
					onClick={handleSearchByBtnClick.bind(this, searchByType)}
				>
					{searchByType.name}
				</S.SearchByButton>
			))}
		</S.SearchByButtons>
	)
}

export default SearchByButtons
