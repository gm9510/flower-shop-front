export default function AboutView() {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-4xl font-bold text-primary mb-6">Acerca de Bloom & Petals</h1>

      <div className="space-y-6 text-foreground/80">
        <p>
          Desde 1995, Bloom & Petals ha estado entregando alegría a través de hermosos arreglos florales. Nuestra pasión por
          las flores y compromiso con la excelencia nos ha convertido en la opción confiable de miles de clientes.
        </p>

        <div className="grid md:grid-cols-3 gap-6 my-8">
          <div className="bg-secondary/10 p-6 rounded-lg text-center">
            <div className="text-3xl font-bold text-primary mb-2">500+</div>
            <p className="text-foreground/70">Clientes Felices Diariamente</p>
          </div>
          <div className="bg-secondary/10 p-6 rounded-lg text-center">
            <div className="text-3xl font-bold text-primary mb-2">30 Años</div>
            <p className="text-foreground/70">Experiencia en la Industria</p>
          </div>
          <div className="bg-secondary/10 p-6 rounded-lg text-center">
            <div className="text-3xl font-bold text-primary mb-2">100%</div>
            <p className="text-foreground/70">Flores Frescas</p>
          </div>
        </div>

        <p>
          Cada arreglo es elaborado a mano con flores premium provenientes de los mejores cultivadores. Creemos que las flores
          son la forma natural de expresar emociones, y nos honra ayudarte a compartir esos momentos especiales.
        </p>

        <div className="mt-8 space-y-2">
          <h3 className="text-xl font-semibold text-primary">Contáctanos</h3>
          <p>Correo: hello@bloompetals.com</p>
          <p>Teléfono: (555) 123-4567</p>
          <p>Dirección: 123 Garden Lane, Flower City, FC 12345</p>
        </div>
      </div>
    </div>
  )
}
