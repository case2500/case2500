import React from 'react'
import PropTypes from 'prop-types'

const Footerv1 = ({title, website, postcode, isOpen}) => {
    // const {title, website, postcode} = props;
    return (
        <div>
            <h1 style={styles.title}>{title} &copy; {new Date().getFullYear()}</h1>
            <p style={{color: 'green', fontSize: 16}}>{website} {postcode} isOpen: {isOpen.toString()}</p>
            <p style={styles.title}>codingthailand</p>
        </div>
    )
}

const styles = {
    title: {
        color: 'red'
    }
}

Footer.propTypes = {
    title: PropTypes.string,
    website: PropTypes.string,
    postcode: PropTypes.number,
    isOpen: PropTypes.bool
};

export default Footerv1
