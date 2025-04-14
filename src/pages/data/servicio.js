const servicios = [
    {
        id: '1',
        nombre: 'Manicure semipermanente',
        imagen: 'https://i.pinimg.com/236x/4a/a6/e7/4aa6e7e4738a67c46066fdb7ce25069f.jpg',
        descripcion: 'El manicure semipermanente ofrece un acabado impecable y duradero que puede mantenerse intacto hasta por dos semanas. Ideal para quienes buscan practicidad sin renunciar al estilo, este servicio incluye preparación de la uña, esmaltado con gel UV y secado en lámpara LED. Sus colores vibrantes y resistencia lo convierten en la opción favorita para lucir unas manos siempre perfectas.'
    },
    {
        id: '2',
        nombre: 'Manicure tradicional',
        imagen: 'https://semilac.pl/media/webp_image/catalog/product/cache/73595e8c109d812957f8a30f638a0cef/s/t/stylizacja_211_jpeg.webp',
        descripcion: 'El manicure tradicional es un clásico atemporal que brinda limpieza, frescura y elegancia a tus manos. Incluye limado, limpieza de cutículas y aplicación de esmalte regular en el color de tu preferencia. Es perfecto para quienes desean un look cuidado y natural, con la flexibilidad de cambiar de estilo con mayor frecuencia.'
    },
    {
        id: '3',
        nombre: 'Manicure spa',
        imagen: 'https://www.blog.cazcarra.com/wp-content/uploads/2015/04/destacada760x3509.jpg',
        descripcion: 'Más que un simple arreglo de uñas, el manicure spa es una experiencia completa de relajación. Comienza con un baño tibio para manos, seguido de exfoliación, mascarilla hidratante y masaje con aceites esenciales. Además del esmaltado, este servicio busca revitalizar la piel y fortalecer las uñas, dejándote con una sensación de bienestar total.'
    },
    {
        id: '4',
        nombre: 'Pedicure semipermanente',
        imagen: 'https://sumerlabs.com/default/image-tool-lambda?new-width=0&new-height=0&new-quality=25&url-image=https%3A%2F%2Fsumerlabs.com%2Fsumer-app-90b8f.appspot.com%2Fproduct_photos%252F4c3ed0de273635869644cc401fa9e4df%252F9fb518c0-7636-11ec-b47d-0325d37c715e%3Falt%3Dmedia%26token%3De5a31164-7a4d-49ec-beba-1048bcaef9a9',
        descripcion: 'El pedicure semipermanente es la solución ideal para mantener tus pies bonitos y cuidados durante más tiempo. Comienza con un tratamiento de limpieza profunda, seguido por el limado de uñas, tratamiento de cutículas y aplicación de esmalte en gel que se seca con lámpara. Tus pies se verán impecables por semanas, sin preocuparte por retoques constantes.'
    },
    {
        id: '5',
        nombre: 'Pedicure tradicional',
        imagen: 'https://laesquinadelabelleza.tiendada.com/api/scrooge/file/FL-4A2A796A',
        descripcion: 'El pedicure tradicional ofrece una limpieza básica pero efectiva, ideal para mantener tus pies sanos y con buen aspecto. Se realiza un remojo relajante, seguido de exfoliación, corte y limado de uñas, remoción de durezas y aplicación de esmalte clásico. Es un servicio práctico para incluir en tu rutina de cuidado personal.'
    },
    {
        id: '6',
        nombre: 'Pedicure spa',
        imagen: 'https://resizer.sevilla.abc.es/resizer/resizer.php?imagen=https://sevilla.abc.es/estilo/bulevarsur/wp-content/uploads/sites/14/2018/07/Que-es-la-pedicura-spa.jpg&nuevoancho=652',
        descripcion: 'El pedicure spa es un tratamiento de lujo que combina estética y bienestar. Comienza con un baño de pies con sales relajantes, exfoliación con productos naturales, mascarilla hidratante y masaje con aceites esenciales. Además del esmaltado, este servicio suaviza la piel, mejora la circulación y alivia el cansancio, ideal para consentirte al máximo.'
    },
    {
        id: '7',
        nombre: 'Esculpidas',
        imagen: 'https://www.infobae.com/resizer/v2/LQ32BIT3CFETLGC7F3HWMIYBKM.jpg?auth=a21785a8026ac5239695e9d3734aa7297743fa462588aff92529a3f4b00cef38&smart=true&width=350&height=197&quality=85',
        descripcion: 'Las uñas esculpidas son perfectas para quienes desean alargar y dar forma a sus uñas naturales con un acabado resistente y elegante. Utilizando materiales como acrílico o gel, se moldean manualmente para lograr una apariencia impecable y duradera. Puedes elegir entre un look natural o personalizado con colores y decoraciones a tu gusto.'
    },
    {
        id: '8',
        nombre: 'Decoradas',
        imagen: 'https://www.marias.com.co/wp-content/uploads/2022/11/decorados-de-moda-para-unas.jpg',
        descripcion: 'El servicio de uñas decoradas es ideal para expresar tu estilo personal a través del arte en tus manos. Utilizamos técnicas de pintura, piedras, foil, glitter y más para crear diseños únicos y creativos. Cada decoración se realiza con precisión y atención al detalle, perfecta para ocasiones especiales o simplemente para destacar en tu día a día.'
    },
    {
        id: '9',
        nombre: 'Francesas',
        imagen: 'https://i.ytimg.com/vi/8YJXEuu3Xw4/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDz9JGEE8CyMb-2Y-9Cyg-8C77HTQ',
        descripcion: 'La manicure francesa es sinónimo de elegancia y sofisticación. Con su característico borde blanco sobre una base rosada o natural, este estilo resalta la belleza de tus uñas de manera sutil y refinada. Es ideal tanto para eventos formales como para el día a día, combinando con cualquier look por su simplicidad y pulcritud.'
    },
    {
        id: '10',
        nombre: 'Uñas Baby Boomer',
        imagen: 'https://media.vogue.mx/photos/661057963724f7e6044a7348/2:3/w_2560%2Cc_limit/LMS-VOGUEUK-BEAUT-26324-NUDENAILS1.jpg',
        descripcion: 'Las uñas Baby Boomer son la tendencia perfecta si buscas un estilo moderno y elegante. Este diseño es una fusión sutil entre el clásico francés y un degradado natural, creando un efecto difuminado que va del blanco al rosa o nude. Ideales para quienes aman lo delicado pero con un toque actual, perfectas para cualquier ocasión.'
    }

];

export default servicios;
