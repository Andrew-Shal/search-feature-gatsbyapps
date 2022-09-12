import React from "react"
import styled from "styled-components"

const F = {
	FilterByDropDown: styled.div`
		width: 150px;
		select {
			width: 100%;
			option {
			}
		}
	`,
}

const FilterByDropDown = ({ selected, options, onChange }) => {
	const handleOnChange = (e) => {
		console.log("FilterByDropDown changed value: ", e.target.value)

		const selectedOption =
			options.find((option) => option.value == e.target.value) || selected
		onChange(selectedOption)
	}

	return (
		<F.FilterByDropDown>
			<select value={selected.value} onChange={handleOnChange}>
				{options.map((opt) => (
					<option key={opt.id} value={opt.value}>
						{opt.label}
					</option>
				))}
			</select>
		</F.FilterByDropDown>
	)
}

export default FilterByDropDown
