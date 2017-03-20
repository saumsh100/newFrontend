
import React, { PropTypes, Component } from 'react';
import styles from './styles.scss';



export class IconBox extends Component {
	render () {
		const { icon, iconColor, background, iconAlign } = this.props.data;
		const iconClass = `fa fa-${icon}`;
		const styles = {
			color: iconColor,
			background,
			textAlign: iconColor,
			width: '50px',
			height: '40px',
			paddingTop: '10px',
  		fontSize: '25px',
		}
		return (
  		<div style={styles}>
  			<span className={iconClass}></span>
  		</div>			
		);
	}
}


export class BigCommentBubble extends Component {
	render () {
	  return (
	  	<div  className={styles.bigCommentBubble}>

	  		<IconBox data={{ icon: 'facebook', iconColor: '#ffffff', background: '#395998', iconAlign: 'center' }} />
	  		<div className={styles.bigCommentBubble__commentBody} >
		  		<div className={styles.bigCommentBubble__mainContent} >
			  		<div className={styles.bigCommentBubble__mainContent__header} >
			  			<span className={styles.bigCommentBubble__mainContent__header__link}>L. Linda </span>
			  			reviewed your buisiness on 
			  			<span className={styles.bigCommentBubble__mainContent__header__link}> yelp.ca </span>
			  		</div>
			  		<div className={styles.bigCommentBubble__mainContent__rating} >
			  			<span className="fa fa-star" ></span>
			  			<span className="fa fa-star" ></span>
			  			<span className="fa fa-star" ></span>
			  			<span className="fa fa-star" ></span>
			  			<span className="fa fa-star" ></span>
			  			<span className="fa fa-star" ></span>
			  		</div>
			  		<div className={styles.bigCommentBubble__mainContent__title} >
			  			Lorem Ipsum is simply dummy text of theeMaker including versions of Lorem Ipsum.
			  		</div>
			  		<div className={styles.bigCommentBubble__mainContent__preview} >
							Lorem Ipsum is simply dummy text of the printing and typesetting industry.
							Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
							when an unknown printer took a galley of type and scrambled it to make a type specimen book.
							It has survived not only five centuries, but also the leap into electronic typesetting,
							remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets
							containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker
							including versions of Lorem Ipsum.
				  		<span className={styles.bigCommentBubble__mainContent__preview__toggleButton} >more... </span>
			  		</div>
			  		<div className={styles.bigCommentBubble__mainContent__requirements} >
			  			Action requeired
			  		</div>
			  		<div className={styles.bigCommentBubble__mainContent__createdAt}>10 days ago</div>
		  		</div>
		  		<div className={styles.bigCommentBubble__respondBlock} >
		  			<div className={styles.bigCommentBubble__respondBlock__respondButton} >
		  				Respond
		  			</div>
		  		</div>
		  	</div>
	  	</div>
	  );
	}

}
