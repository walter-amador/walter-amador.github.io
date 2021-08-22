export default function projectsAPI(req, res) {
    res.status(200).json(
        [
            {
                title: 'Whatsapp Web Clone',
                content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus possimus iusto consequuntur, magni quae facilis nemo ab maiores mollitia obcaecati adipisci aut eum maxime repudiandae sunt nihil ratione accusamus eos.',
                img:"/whatsapp-web-clone-img.png",
                techs: ['logos:react','vscode-icons:file-type-css','logos:firebase'],
                repo:'https://github.com/WalterIran/whatsapp-web-clone-app',
                demo:'https://whatsapp-clone-reactjs-1d9af.web.app/'
            },
            {
                title: 'Airbnb Clone',
                content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus possimus iusto consequuntur, magni quae facilis nemo ab maiores mollitia obcaecati adipisci aut eum maxime repudiandae sunt nihil ratione accusamus eos.',
                img:"/airbnb-clone-img.png",
                techs: ['logos:react','logos:nextjs-icon','vscode-icons:file-type-tailwind'],
                repo:'https://github.com/WalterIran/airbnb-clone-app',
                demo:'https://airbnb-clone-app-hjwdf6s38-walteriran.vercel.app/'
            },
            {
                title: 'Amazon Clone',
                content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus possimus iusto consequuntur, magni quae facilis nemo ab maiores mollitia obcaecati adipisci aut eum maxime repudiandae sunt nihil ratione accusamus eos.',
                img:"/amazon-clone-img.png",
                techs: ['logos:react','vscode-icons:file-type-css','logos:firebase'],
                repo:'https://github.com/WalterIran/amazon-clone-app',
                demo:'https://clone-cf475.web.app/'
            },
            {
                title: 'Movie App',
                content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus possimus iusto consequuntur, magni quae facilis nemo ab maiores mollitia obcaecati adipisci aut eum maxime repudiandae sunt nihil ratione accusamus eos.',
                img:"/movie-app-img.png",
                techs: ['logos:react','vscode-icons:file-type-styled','logos:react-router'],
                repo:'https://github.com/WalterIran/movie-react-app',
                demo:'https://movie-app-walteriran.netlify.app/'
            },
            {
                title: 'RNP Honduras',
                content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus possimus iusto consequuntur, magni quae facilis nemo ab maiores mollitia obcaecati adipisci aut eum maxime repudiandae sunt nihil ratione accusamus eos.',
                img:"/rnp-clone-img.png",
                techs: ['logos:laravel','logos:bootstrap','simple-icons:mysql'],
                repo:'https://github.com/WalterIran/rnp-clone-app',
                demo:'https://clonrnp.laperlatech.com/'
            },
            {
                title: 'CamiDental Desktop',
                content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus possimus iusto consequuntur, magni quae facilis nemo ab maiores mollitia obcaecati adipisci aut eum maxime repudiandae sunt nihil ratione accusamus eos.',
                img:"/camidental-app.png",
                techs: ['logos:c-sharp','logos:aws','simple-icons:microsoftsqlserver','logos:google-calendar'],
                repo:'',
                demo:''
            },
        ]
    );
  }