import React from 'react'
import styled from 'styled-components'

const F = {
    FilterByDropDown: styled.div`
        width: 150px;
        select {
            width: 100%;
            background: #f9eed3;
            border: 1px solid #c7b380;
            padding: 5px 5px;
            option {
                &[value=''][disabled] {
                    display: none;
                }
            }
        }
    `,
}

const FilterByDropDown = ({ selected, options, placeholder, onChange }) => {
    const handleOnChange = (e) => {
        console.log('FilterByDropDown changed value: ', e.target.value)

        const selectedOption = options.find((option) => option === e.target.value)
        onChange(selectedOption)
    }

    const placeHolderElement = placeholder ? (
        <option disabled value="">
            {placeholder}
        </option>
    ) : null

    return (
        <F.FilterByDropDown>
            <select value={selected} onChange={handleOnChange}>
                {placeHolderElement}
                {options.map((opt) => (
                    <option key={opt} value={opt}>
                        {opt}
                    </option>
                ))}
            </select>
        </F.FilterByDropDown>
    )
}

export default FilterByDropDown
