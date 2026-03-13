import Link from "next/link"
import JTQHeader from "@/components/JTQHeader"
import { ORGANIZER_NAME, ORGANIZER_ORG, LOCATION } from "@/lib/constants"

export default function PrivacidadPage() {
  return (
    <main className="mx-auto max-w-lg px-4 pb-12">
      <JTQHeader />

      <article className="mt-6 space-y-6 text-sm text-jtq-text leading-relaxed">
        <h2 className="text-xl font-bold text-jtq-text">Aviso de Privacidad</h2>

        <section>
          <h3 className="font-semibold text-jtq-text mb-1">Responsable</h3>
          <p>
            {ORGANIZER_NAME}, en coordinación con {ORGANIZER_ORG}, con sede en{" "}
            {LOCATION}, México, es responsable del tratamiento de los datos
            personales que usted proporcione a través de esta plataforma.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-jtq-text mb-1">
            Datos personales recabados
          </h3>
          <p>Para el registro en nuestras campañas sociales y humanitarias, recabamos los siguientes datos:</p>
          <ul className="mt-2 list-disc list-inside space-y-1 text-jtq-muted">
            <li>Nombre completo</li>
            <li>Número de WhatsApp</li>
            <li>Tipo de mascota (perro o gato)</li>
            <li>Nombre de la mascota (opcional)</li>
          </ul>
        </section>

        <section>
          <h3 className="font-semibold text-jtq-text mb-1">
            Finalidad del tratamiento
          </h3>
          <p>
            Sus datos personales serán utilizados exclusivamente para las
            siguientes finalidades:
          </p>
          <ul className="mt-2 list-disc list-inside space-y-1 text-jtq-muted">
            <li>Contactarlo(a) por WhatsApp para coordinar la fecha y hora de su cita</li>
            <li>Registro y control de participantes en campañas sociales y humanitarias</li>
            <li>Verificación de identidad el día del evento mediante código QR</li>
          </ul>
        </section>

        <section>
          <h3 className="font-semibold text-jtq-text mb-1">
            Derechos ARCO
          </h3>
          <p>
            Usted tiene derecho a Acceder, Rectificar, Cancelar u Oponerse al
            tratamiento de sus datos personales (derechos ARCO), conforme a la
            Ley Federal de Protección de Datos Personales en Posesión de los
            Particulares (LFPDPPP).
          </p>
          <p className="mt-2">
            Para ejercer cualquiera de estos derechos, puede enviar su solicitud
            a través de WhatsApp o en persona en las oficinas de {ORGANIZER_ORG}{" "}
            en {LOCATION}.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-jtq-text mb-1">
            Conservación de datos
          </h3>
          <p>
            Sus datos personales serán conservados mientras la campaña se
            encuentre activa y hasta un máximo de un (1) año posterior a la
            conclusión de la misma, tras lo cual serán eliminados de forma
            segura.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-jtq-text mb-1">
            Transferencia de datos
          </h3>
          <p>
            Sus datos personales no serán compartidos, vendidos ni transferidos a
            terceros bajo ninguna circunstancia, salvo requerimiento expreso de
            autoridad competente.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-jtq-text mb-1">
            Cambios al aviso de privacidad
          </h3>
          <p>
            Nos reservamos el derecho de modificar este aviso de privacidad. Cualquier
            cambio será publicado en esta misma página.
          </p>
        </section>

        <p className="text-xs text-jtq-muted">
          Última actualización: marzo 2026
        </p>
      </article>

      <div className="mt-8 text-center">
        <Link
          href="/"
          className="inline-block rounded-lg bg-jtq-primary px-6 py-3 text-sm font-semibold text-white"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  )
}
