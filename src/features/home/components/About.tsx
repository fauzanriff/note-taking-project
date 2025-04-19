import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components'
import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12">
      <h1 className="text-4xl font-bold">About Page</h1>
      <Card className="mt-8 w-[450px]">
        <CardHeader>
          <CardTitle>About This Project</CardTitle>
          <CardDescription>Learn more about this React starter template</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            This is a React starter template built with:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>React with TypeScript</li>
            <li>Vite for fast development and building</li>
            <li>Tailwind CSS for styling</li>
            <li>shadcn/ui for beautiful, accessible components</li>
            <li>React Router for navigation</li>
            <li>Firebase for authentication, database, storage, and analytics</li>
            <li>Environment variables for secure configuration</li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button asChild variant="outline" className="w-full">
            <Link to="/">Back to Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
