
"use client"

import * as React from "react"
import { Moon, Sun, Palette, Bot, Sparkles, Waves, Sunset, Shield, Gem } from "lucide-react"
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
        <div className="grid grid-cols-2 gap-2 pt-2">
            <Button variant="outline" onClick={() => setTheme("dark")}>
                <Moon className="mr-2 h-4 w-4" />
                <span>Default Dark</span>
            </Button>
            <Button variant="outline" onClick={() => setTheme("theme-neural-pulse")}>
                <Bot className="mr-2 h-4 w-4" />
                <span>Neural Pulse</span>
            </Button>
            <Button variant="outline" onClick={() => setTheme("theme-solar-flare")}>
                <Sun className="mr-2 h-4 w-4" />
                <span>Solar Flare</span>
            </Button>
            <Button variant="outline" onClick={() => setTheme("theme-quantum-neon")}>
                <Sparkles className="mr-2 h-4 w-4" />
                <span>Quantum Neon</span>
            </Button>
            <Button variant="outline" onClick={() => setTheme("theme-abyssal-ocean")}>
                <Waves className="mr-2 h-4 w-4" />
                <span>Abyssal Ocean</span>
            </Button>
            <Button variant="outline" onClick={() => setTheme("theme-synthwave-sunset")}>
                <Sunset className="mr-2 h-4 w-4" />
                <span>Synthwave</span>
            </Button>
            <Button variant="outline" onClick={() => setTheme("theme-crimson-cipher")}>
                <Shield className="mr-2 h-4 w-4" />
                <span>Crimson Cipher</span>
            </Button>
            <Button variant="outline" onClick={() => setTheme("theme-gilded-serpent")}>
                <Gem className="mr-2 h-4 w-4" />
                <span>Gilded Serpent</span>
            </Button>
        </div>
    </div>
  )
}

    