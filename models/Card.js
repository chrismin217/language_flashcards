module.exports = function (sequelize, DataTypes){

  const Card = sequelize.define('Card', {
    question: {type: DataTypes.STRING, allowNull: false},
    answer: {type: DataTypes.STRING, allowNull: false}
  },
    {tableName: 'cards'}
  );

  Card.associate = function (models) {
    Card.belongsTo(models.Deck, {
      foreignKey: 'card_id',
      as: 'Card'
    });
  }

  return Card;
}