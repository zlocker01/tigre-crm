import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarClock } from 'lucide-react';
import type { Employee } from '@/interfaces/employees/Employee';

export function Team({ data }: { data: Employee[] }) {
  return (
    <section id="team" className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((member) => {
            let skillsArray: string[] = [];

            if (Array.isArray(member.skills)) {
              skillsArray = member.skills;
            } else if (typeof member.skills === 'string') {
              const skillsString = String(member.skills).trim();
              try {
                // Intenta parsear como JSON si parece un array serializado
                if (
                  skillsString.startsWith('[') &&
                  skillsString.endsWith(']')
                ) {
                  skillsArray = JSON.parse(skillsString);
                } else {
                  skillsArray = skillsString.split(',').map((s) => s.trim());
                }
              } catch (err) {
                console.warn('Error al parsear skills:', err);
                skillsArray = [];
              }
            }

            const hasImage =
              typeof member.image === 'string' &&
              member.image.trim().length > 0;

            return (
              <div key={member.id}>
                <Card className="overflow-hidden flex flex-col h-full w-full max-w-sm mx-auto">
                  <div className="relative w-full aspect-[4/3] overflow-hidden">
                    {hasImage ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted" />
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle>{member.name}</CardTitle>
                    <CardDescription>{member.position}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {member.experience}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {skillsArray.map((skill, index) => (
                        <Badge key={index} variant="gold">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    {/* <Button asChild className="w-full">
                    <Link href="#booking" className="flex items-center gap-2">
                      <CalendarClock className="h-4 w-4" />
                      Agendar con {member.name.split(' ')[0]}
                    </Link>
                  </Button> */}
                  </CardFooter>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
