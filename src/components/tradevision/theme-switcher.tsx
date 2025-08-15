
"use client"

import * as React from "react"
import { Moon, Sun, Palette } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardDescription, CardTitle } from "../ui/card"

export function ThemeSwitcher() {
  const { setTheme } = useTheme()

  return (
    <div className="space-y-2">
        <CardTitle>Select Theme</CardTitle>
        <CardDescription>Customize the look and feel of the application.</CardDescription>
        <div className="grid grid-cols-2 gap-4 pt-2">
            <Button variant="outline" onClick={() => setTheme("dark")}>
                <Moon className="mr-2 h-4 w-4" />
                <span>Neural Pulse</span>
            </Button>
            <Button variant="outline" onClick={() => setTheme("theme-solar-flare")}>
                <Sun className="mr-2 h-4 w-4" />
                <span>Solar Flare</span>
            </Button>
        </div>
    </div>
  )
}
