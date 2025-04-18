import { useState } from 'react'
import reactLogo from '@/assets/react.svg'
import viteLogo from '/vite.svg'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function Home() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12">
      <div className="flex space-x-4">
        <a href="https://vite.dev" target="_blank" className="transition-transform hover:scale-110">
          <img src={viteLogo} className="h-24 w-24" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" className="transition-transform hover:scale-110">
          <img src={reactLogo} className="h-24 w-24 animate-spin-slow" alt="React logo" />
        </a>
      </div>
      <h1 className="mt-6 text-4xl font-bold">Vite + React + Tailwind + shadcn/ui</h1>
      <Card className="mt-8 w-[350px]">
        <CardHeader>
          <CardTitle>Counter Example</CardTitle>
          <CardDescription>A simple counter using shadcn/ui components</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => setCount((count) => count + 1)}
            variant="default"
            className="w-full"
          >
            count is {count}
          </Button>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          Edit <code className="rounded bg-muted px-1 font-mono text-xs">src/pages/Home.tsx</code> and save to test HMR
        </CardFooter>
      </Card>
      <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}
