import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Award } from 'lucide-react';
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

            skillsArray = skillsArray
              .map((skill) => {
                let s = String(skill).trim();
                if (!s) return '';
                try {
                  if (
                    (s.startsWith('"') && s.endsWith('"')) ||
                    (s.startsWith('[') && s.endsWith(']'))
                  ) {
                    const parsed = JSON.parse(s);
                    if (typeof parsed === 'string') return parsed;
                    if (Array.isArray(parsed)) {
                      return parsed.join(' · ');
                    }
                  }
                } catch {}
                s = s.replace(/^\["?/, '').replace(/"?\]$/, '');
                s = s.replace(/^"+|"+$/g, '');
                return s;
              })
              .filter((s) => s.length > 0);

            const hasImage =
              typeof member.image === 'string' &&
              member.image.trim().length > 0;

            return (
              <div key={member.id}>
                <Card className="flex h-full w-full max-w-sm mx-auto flex-col overflow-hidden rounded-3xl border border-border/40 bg-background shadow-sm transition-all hover:shadow-lg">
                  <div className="relative h-64 overflow-hidden bg-background flex items-center justify-center">
                    {hasImage ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="max-h-full w-auto object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-full w-full bg-muted" />
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
                  </div>
                  <CardHeader className="p-6 pb-3">
                    <CardTitle className="text-2xl font-bold text-foreground">
                      {member.name}
                    </CardTitle>
                    <CardDescription className="mt-1 text-accent">
                      {member.position}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 px-6 pb-6">
                    {skillsArray.length > 0 && (
                      <div className="rounded-xl border bg-card p-3 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
                            <Shield className="h-4 w-4 text-primary" />
                          </div>
                          <div className="text-sm">
                            <p className="text-muted-foreground">
                              Especialidad
                            </p>
                            <p className="font-medium">
                              {skillsArray.slice(0, 2).join(' · ')}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    {member.experience && (
                      <p className="text-sm text-muted-foreground">
                        {member.experience}
                      </p>
                    )}
                    {skillsArray.length > 2 && (
                      <div className="flex flex-wrap gap-2">
                        {skillsArray.slice(2).map((skill, index) => (
                          <Badge key={index} variant="gold">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="hidden" />
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
