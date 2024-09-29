const Trending = () => {
    return(
        <div className="trending-contr">
            <div className="heading">Top Rated</div>
            <div className="rated-wrapper">
                {['The essay that rebranded micromanagement','The essay that rebranded micromanagement','The essay that rebranded micromanagement'].map((ele) => {
                    return <div className="top-blog">{ele}</div>
                })}
            </div>
        </div>
    )
}

export default Trending;