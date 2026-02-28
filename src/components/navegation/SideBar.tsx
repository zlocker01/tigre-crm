'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Logout } from '../auth/Logout';
import {
  Users,
  UserCircle,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Target,
  FileSpreadsheet,
  StickyNote,
  Pill,
  FileText,
  Edit,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const SideBar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [patientSubmenuOpen, setPatientSubmenuOpen] = useState<boolean>(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Extraer el ID del paciente de la URL si existe
  const patientIdMatch = pathname.match(/\/pacientes\/[\w-]+\/([a-zA-Z0-9-]+)/);
  const patientIdFromPath = patientIdMatch ? patientIdMatch[1] : null;

  // Determinar el ID del paciente para los enlaces del submenú
  const currentPatientId =
    patientIdFromPath ||
    pathname
      .split('/')
      .find(
        (segment) =>
          segment !== '' &&
          segment !== 'pacientes' &&
          segment !== 'detalles' &&
          segment !== 'editar' &&
          segment !== 'objetivos' &&
          segment !== 'pruebas-psicometricas' &&
          segment !== 'notas' &&
          segment !== 'medicamentos' &&
          segment !== 'documentos',
      );
  const hasPatientId = !!currentPatientId;

  const isPatientSection =
    pathname.includes('/pacientes') ||
    pathname.includes('/objetivos') ||
    pathname.includes('/pruebas-psicometricas') ||
    pathname.includes('/notas') ||
    pathname.includes('/medicamentos') ||
    pathname.includes('/documentos');

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const togglePatientSubmenu = () => {
    setPatientSubmenuOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target as Node) &&
      window.innerWidth <= 768
    ) {
      setIsOpen(false);
    }
  };

  // Determinar qué sección está activa
  const isActive = (path: string) => {
    if (path === '/pacientes') {
      return pathname === '/pacientes' || pathname.startsWith('/pacientes/');
    }
    return pathname === path;
  };

  const isSubActive = (subPath: string) => {
    if (subPath === 'detalles') {
      return pathname.includes('/pacientes/detalles/');
    }
    if (subPath === 'editar') {
      return pathname.includes('/pacientes/editar/');
    }
    if (subPath === 'objetivos') {
      return pathname.includes('/objetivos/');
    }
    if (subPath === 'pruebas') {
      return pathname.includes('/pruebas-psicometricas/');
    }
    if (subPath === 'notas') {
      return pathname.includes('/notas/');
    }
    if (subPath === 'medicamentos') {
      return pathname.includes('/medicamentos/');
    }
    if (subPath === 'documentos') {
      return pathname.includes('/documentos/');
    }
    return false;
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    // Auto-abrir el submenú de pacientes si estamos en una sección de pacientes
    if (isPatientSection) {
      setPatientSubmenuOpen(true);
    } else {
      setPatientSubmenuOpen(false); // Asegurarse de que esté cerrado en otras secciones
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPatientSection]);

  return (
    <nav>
      {/* Overlay solo cuando el sidebar está abierto en móvil */}
      <div
        className={`fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleMenu}
        aria-hidden={!isOpen}
      />

      <button
        onClick={toggleMenu}
        className="fixed bottom-6 left-6 z-50 flex md:hidden bg-primaryColor hover:bg-primaryColor/90 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
        aria-label="Toggle Sidebar"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 z-30 w-64 h-screen transition-all duration-300 ease-in-out bg-card border-r border-border shadow-lg ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`} // Clases clave: fixed, z-40, w-64, h-screen, translate-x
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-6 overflow-y-auto">
          <div className="flex items-center justify-center mb-8">
            <h1 className="text-2xl font-bold text-primaryColor">
              JSBJJMX
            </h1>
          </div>

          <ul className="space-y-2 font-medium">
            {/* Sección de Alumnos */}
            {pathname !== '/perfil' ? (
              <li>
                <div
                  className={cn(
                    'flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all',
                    isActive('/pacientes')
                      ? 'bg-primaryColor text-white'
                      : 'text-primaryText dark:text-secondaryText hover:bg-muted',
                  )}
                  onClick={togglePatientSubmenu}
                >
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-3" />
                    <span>Alumnos</span>
                  </div>
                  {patientSubmenuOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </div>

                {/* Submenú de Alumnos */}
                {patientSubmenuOpen && (
                  <ul className="mt-2 ml-6 space-y-1 border-l-2 border-muted pl-4">
                    <li>
                      <Link
                        href="/pacientes"
                        className={cn(
                          'flex items-center p-2 rounded-md transition-colors',
                          pathname === '/pacientes'
                            ? 'bg-primaryColor/10 text-primaryColor font-medium'
                            : 'text-muted-foreground hover:bg-muted hover:text-primaryText',
                        )}
                      >
                        <span>Lista de Alumnos</span>
                      </Link>
                    </li>

                    {/* Mostrar opciones específicas del paciente solo si hay un ID de paciente */}
                    {hasPatientId && (
                      <>
                        <li>
                          <Link
                            href={`/pacientes/detalles/${currentPatientId}`}
                            className={cn(
                              'flex items-center p-2 rounded-md transition-colors',
                              isSubActive('detalles')
                                ? 'bg-primaryColor/10 text-primaryColor font-medium'
                                : 'text-muted-foreground hover:bg-muted hover:text-primaryText',
                            )}
                          >
                            <span>Detalles</span>
                          </Link>
                        </li>
                        <li>
                          <Link
                            href={`/pacientes/editar/${currentPatientId}`}
                            className={cn(
                              'flex items-center p-2 rounded-md transition-colors',
                              isSubActive('editar')
                                ? 'bg-primaryColor/10 text-primaryColor font-medium'
                                : 'text-muted-foreground hover:bg-muted hover:text-primaryText',
                            )}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            <span>Editar Cliente</span>
                          </Link>
                        </li>
                        <li>
                          <Link
                            href={`/objetivos/${currentPatientId}`}
                            className={cn(
                              'flex items-center p-2 rounded-md transition-colors',
                              isSubActive('objetivos')
                                ? 'bg-primaryColor/10 text-primaryColor font-medium'
                                : 'text-muted-foreground hover:bg-muted hover:text-primaryText',
                            )}
                          >
                            <Target className="h-4 w-4 mr-2" />
                            <span>Objetivos</span>
                          </Link>
                        </li>
                        <li>
                          <Link
                            href={`/pruebas-psicometricas/${currentPatientId}`}
                            className={cn(
                              'flex items-center p-2 rounded-md transition-colors',
                              isSubActive('pruebas')
                                ? 'bg-primaryColor/10 text-primaryColor font-medium'
                                : 'text-muted-foreground hover:bg-muted hover:text-primaryText',
                            )}
                          >
                            <FileSpreadsheet className="h-4 w-4 mr-2" />
                            <span>Pruebas</span>
                          </Link>
                        </li>
                        <li>
                          <Link
                            href={`/notas/${currentPatientId}`}
                            className={cn(
                              'flex items-center p-2 rounded-md transition-colors',
                              isSubActive('notas')
                                ? 'bg-primaryColor/10 text-primaryColor font-medium'
                                : 'text-muted-foreground hover:bg-muted hover:text-primaryText',
                            )}
                          >
                            <StickyNote className="h-4 w-4 mr-2" />
                            <span>Notas</span>
                          </Link>
                        </li>
                        <li>
                          <Link
                            href={`/medicamentos/${currentPatientId}`}
                            className={cn(
                              'flex items-center p-2 rounded-md transition-colors',
                              isSubActive('medicamentos')
                                ? 'bg-primaryColor/10 text-primaryColor font-medium'
                                : 'text-muted-foreground hover:bg-muted hover:text-primaryText',
                            )}
                          >
                            <Pill className="h-4 w-4 mr-2" />
                            <span>Medicamentos</span>
                          </Link>
                        </li>
                        <li>
                          <Link
                            href={`/documentos/${currentPatientId}`}
                            className={cn(
                              'flex items-center p-2 rounded-md transition-colors',
                              isSubActive('documentos')
                                ? 'bg-primaryColor/10 text-primaryColor font-medium'
                                : 'text-muted-foreground hover:bg-muted hover:text-primaryText',
                            )}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            <span>Documentos</span>
                          </Link>
                        </li>
                      </>
                    )}
                  </ul>
                )}
              </li>
            ) : (
              // This block runs when pathname === '/perfil'
              <li>
                <Link
                  href="/pacientes"
                  className={cn(
                    'flex items-center p-3 rounded-lg cursor-pointer transition-all',
                    'text-primaryText dark:text-secondaryText hover:bg-muted',
                  )}
                >
                  <Users className="h-5 w-5 mr-3" />
                  {/* Changed text slightly for clarity when on /perfil */}
                  <span>Ir a Pacientes</span>
                </Link>
              </li>
            )}

            {/* Sección Perfil */}
            <li>
              <Link
                href="/perfil"
                className={cn(
                  'flex items-center p-3 rounded-lg cursor-pointer transition-all',
                  pathname === '/perfil'
                    ? 'bg-primaryColor text-white'
                    : 'text-primaryText dark:text-secondaryText hover:bg-muted',
                )}
              >
                <UserCircle className="h-5 w-5 mr-3" />
                <span>Perfil</span>
              </Link>
            </li>

            {/* Agregar otras secciones aquí */}
            <li>
              <Logout />
            </li>
          </ul>
        </div>
      </aside>
    </nav>
  );
};
