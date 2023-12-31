const Sequelize = require('sequelize');
const model = (sequelize) => {
  const Assignment = sequelize.define('Assignment', {
    assignment_id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV1,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    points: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate:{
          min: 1,
          max: 10
      }
    },
    num_of_attempts: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 3
      },
    },
    deadline: {
      type: Sequelize.DATE,
      allowNull: false
    },
    assignment_created: {
      type: Sequelize.DATE,
      readonly: true
    },
    assignment_updated: {
      type: Sequelize.DATE,
      readonly: true
    }},
    {
      createdAt: 'assignment_created',
      updatedAt: 'assignment_updated'
    }
  );
  return Assignment
}

module.exports = model;