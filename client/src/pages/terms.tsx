import { useState } from "react";

export default function Terms() {
  const [spanish, setSpanish] = useState(false);
  const updated = new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-3xl mx-auto px-4 py-10 md:py-14">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-serif font-bold">Terms of Use</h1>
          <button
            onClick={() => setSpanish(s => !s)}
            className="text-xs md:text-sm px-3 py-1 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {spanish ? "View in English" : "Ver en Español"}
          </button>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 mb-6">Updated: {updated}</p>

        {!spanish ? (
          <div className="prose prose-sm dark:prose-invert max-w-none text-[13px] leading-6">
            <h2 className="text-base font-semibold">1. Nature of the Service</h2>
            <p>
              This platform operates solely as a <strong>connector</strong> between individuals who offer
              services ("Guides") and individuals interested in such services ("Users"). We <strong>do not sell</strong>
              or organize any services; we do not handle execution, logistics, payments, or define terms. We facilitate contact only.
            </p>

            <h2 className="text-base font-semibold mt-5">2. Disclaimer of Liability</h2>
            <p>
              To the fullest extent permitted by law, the platform, its team, and affiliates <strong>disclaim all liability</strong> for
              decisions, acts, omissions, damages, losses, effects, or outcomes arising from interactions between Guides and Users. Each party acts by
              <strong> their own free will and discernment</strong>.
            </p>
            <ul className="list-disc pl-5 mt-2">
              <li>The platform does not guarantee quality, safety, legality, efficacy, or results.</li>
              <li>Descriptions, prices, promises, and availability are the sole responsibility of each Guide.</li>
              <li>Users should research, assess risks, and consult professionals where appropriate.</li>
            </ul>

            <h2 className="text-base font-semibold mt-5">3. Personal Freedom and Responsibility</h2>
            <p>
              We respect each individual’s personal, spiritual, and wellness path. <strong>Each person freely chooses</strong> their practices and relationships,
              assuming full responsibility for their choices and experiences. The platform does not direct or validate private decisions.
            </p>

            <h2 className="text-base font-semibold mt-5">4. Legal and Regulatory Compliance</h2>
            <p>
              Guides and Users agree to comply with applicable laws (including, where relevant, health, consumer, and tax regulations) in their respective jurisdictions.
              We <strong>do not facilitate or promote</strong> illegal activities. If a service conflicts with local law, it must not be offered or contracted via this platform.
            </p>

            <h2 className="text-base font-semibold mt-5">5. Rules for Guides</h2>
            <ul className="list-disc pl-5">
              <li>Represent services truthfully and clearly, without promises of cure.</li>
              <li>Act with care, ethics, and respect for Users’ autonomy.</li>
              <li>Handle payments, refunds, and support directly with Users.</li>
              <li>Obtain and maintain any licenses/permits required by law.</li>
            </ul>

            <h2 className="text-base font-semibold mt-5">6. Rules for Users</h2>
            <ul className="list-disc pl-5">
              <li>Research and evaluate each Guide and service; participation is your personal decision.</li>
              <li>Consult healthcare or other professionals when relevant.</li>
              <li>Assume the risks of chosen activities and share relevant conditions with the Guide.</li>
              <li>Resolve payments and conditions directly with the Guide.</li>
            </ul>

            <h2 className="text-base font-semibold mt-5">7. Content and Moderation</h2>
            <p>
              The platform may, at its discretion, moderate, hide, or remove content that violates these Terms or the law.
              This does not imply a general duty to monitor or responsibility over third-party content.
            </p>

            <h2 className="text-base font-semibold mt-5">8. Privacy</h2>
            <p>
              Use of the service constitutes acceptance of our privacy practices. A separate Privacy Notice/Policy will be provided.
            </p>

            <h2 className="text-base font-semibold mt-5">9. Changes and Effectiveness</h2>
            <p>
              We may update these Terms to reflect service improvements or legal changes. The effective version is the one published on this page.
            </p>

            <h2 className="text-base font-semibold mt-5">10. Contact</h2>
            <p>
              For questions or reports, contact us via the channels listed on the platform.
            </p>
          </div>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none text-[13px] leading-6">
            <h2 className="text-base font-semibold">1. Naturaleza del Servicio</h2>
            <p>
              Esta plataforma opera como un <strong>espacio de conexión</strong> entre personas que ofrecen servicios ("Guías")
              y personas interesadas en dichas ofertas ("Usuarios"). <strong>No vendemos</strong> ni organizamos servicios; no gestionamos ejecución,
              logística ni pagos. Solo facilitamos el contacto.
            </p>

            <h2 className="text-base font-semibold mt-5">2. Deslinde de Responsabilidad</h2>
            <p>
              En la máxima medida permitida por la ley, la plataforma, su equipo y afiliados <strong>no asumen responsabilidad</strong> por decisiones,
              actos, omisiones, daños o resultados derivados de interacciones entre Guías y Usuarios. Cada parte actúa por <strong>voluntad propia</strong>.
            </p>
            <ul className="list-disc pl-5 mt-2">
              <li>La plataforma no garantiza calidad, seguridad, legalidad, eficacia ni resultados.</li>
              <li>Las descripciones, precios y disponibilidad son responsabilidad exclusiva de cada Guía.</li>
              <li>Los Usuarios deben investigar, evaluar riesgos y consultar profesionales cuando corresponda.</li>
            </ul>

            <h2 className="text-base font-semibold mt-5">3. Libertad y Responsabilidad Personal</h2>
            <p>
              Respetamos el camino personal, espiritual y/o de bienestar de cada individuo. <strong>Cada persona elige libremente</strong> sus prácticas
              y relaciones, asumiendo plena responsabilidad por sus experiencias. La plataforma no dirige decisiones privadas.
            </p>

            <h2 className="text-base font-semibold mt-5">4. Cumplimiento Legal y Normativo</h2>
            <p>
              Guías y Usuarios cumplirán las leyes aplicables en sus jurisdicciones. <strong>No facilitamos ni promovemos</strong> actividades ilegales.
              Si un servicio es incompatible con la ley local, no debe ofrecerse ni contratarse aquí.
            </p>

            <h2 className="text-base font-semibold mt-5">5. Reglas para Guías</h2>
            <ul className="list-disc pl-5">
              <li>Representar servicios con veracidad y sin promesas de curación.</li>
              <li>Actuar con cuidado, ética y respeto a la autonomía del Usuario.</li>
              <li>Gestionar pagos, reembolsos y soporte directamente con el Usuario.</li>
              <li>Cumplir permisos y licencias requeridos por ley.</li>
            </ul>

            <h2 className="text-base font-semibold mt-5">6. Reglas para Usuarios</h2>
            <ul className="list-disc pl-5">
              <li>Investigar y evaluar a cada Guía y servicio; la decisión es personal.</li>
              <li>Consultar profesionales de salud cuando corresponda.</li>
              <li>Asumir los riesgos de las actividades elegidas y comunicar condiciones relevantes al Guía.</li>
              <li>Resolver pagos y condiciones directamente con el Guía.</li>
            </ul>

            <h2 className="text-base font-semibold mt-5">7. Contenido y Moderación</h2>
            <p>
              La plataforma puede moderar u ocultar contenido que infrinja estos Términos o la ley, sin que ello implique obligación general de supervisión.
            </p>

            <h2 className="text-base font-semibold mt-5">8. Privacidad</h2>
            <p>El uso del servicio supone la aceptación de nuestras prácticas de privacidad.</p>

            <h2 className="text-base font-semibold mt-5">9. Cambios y Vigencia</h2>
            <p>Podemos actualizar estos Términos; la versión vigente será la publicada en esta página.</p>

            <h2 className="text-base font-semibold mt-5">10. Contacto</h2>
            <p>Para dudas o reportes, contáctanos por los canales indicados.</p>
          </div>
        )}
      </div>
    </div>
  );
}
