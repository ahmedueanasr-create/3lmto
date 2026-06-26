import Link from "next/link"
import { Star, Users, Clock } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import type { Course } from "@/types/database"

interface CourseCardProps {
  course: Course
  showTeacher?: boolean
}

export function CourseCard({ course, showTeacher = true }: CourseCardProps) {
  return (
    <Link href={`/courses/${course.slug}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
        <div className="aspect-video bg-muted relative overflow-hidden">
          {course.thumbnail_url ? (
            <img
              src={course.thumbnail_url}
              alt={course.title}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <span className="text-4xl">📚</span>
            </div>
          )}
          {course.is_free && (
            <Badge className="absolute top-2 right-2 bg-green-500">مجاني</Badge>
          )}
          {course.is_featured && (
            <Badge className="absolute top-2 left-2" variant="secondary">مميز</Badge>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {course.title}
          </h3>
          {showTeacher && course.teacher && (
            <p className="text-sm text-muted-foreground mb-2">
              {course.teacher.full_name}
            </p>
          )}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {course.avg_rating > 0 && (
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                {course.avg_rating}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {course.total_students}
            </span>
            {course.duration_hours > 0 && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {course.duration_hours} سا
              </span>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <span className="font-bold text-lg">
            {course.is_free ? "مجاني" : formatPrice(course.price)}
          </span>
          <Badge variant="outline">{course.level === "beginner" ? "مبتدئ" : course.level === "intermediate" ? "متوسط" : course.level === "advanced" ? "متقدم" : "جميع المستويات"}</Badge>
        </CardFooter>
      </Card>
    </Link>
  )
}
