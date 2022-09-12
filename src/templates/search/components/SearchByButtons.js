import React from "react"
import styled from "styled-components"

const S = {
	SearchByButtons: styled.div`
		width: 100%;
		display: flex;
		flex-wrap: wrap;
	`,
	SearchByButton: styled.a`
		background: #e9d66c;
		color: #fff;
		width: 50%;
		text-decoration: none;
		@media (min-width: 768px) {
			width: 25%;
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
