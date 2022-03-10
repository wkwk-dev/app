import { createContext, useState } from "react"
import projectColors from "../config/colors.json"
import create from "zustand"

const theme = create(set => ({
	theme: "light",
}))(state => state.theme)

function setTheme(newTheme) {
	theme.setState({ theme: newTheme })
}

function useTheme() {
	return (
		theme,
		setTheme
	)
}

export default useTheme