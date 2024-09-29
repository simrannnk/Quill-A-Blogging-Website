import Slider from "react-slick";
const Carousel = () => {
    var settings = {
        dots: true,
        autoplay:true,
        infinite: true,
        speed: 200,
        slidesToShow: 1,
        slidesToScroll: 1,
      };

    return(
        <Slider {...settings}>
            {["helo", "fdf"].map((item) => {
                return(
                    <div>{item}</div>
                )
            })}

        </Slider>
    )
}

export default Carousel