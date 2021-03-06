import { useDispatch, useSelector } from 'react-redux';
import { useDrop } from 'react-dnd';
import {
  Button,
  ConstructorElement,
  CurrencyIcon,
} from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './BurgerConstructor.module.css';
import { addIngredient, placeOrder, RESET_ORDER_DATA, MOVE_FILLINGS, RESET_BURGER } from '../../redux/actions/burgerConstructorActions';
import { OrderDetails } from '../OrderDetails/OrderDetails';
import { Modal } from '../Modal/Modal';
import { Error } from '../Error/Error';
import { TopBunBibb, FillingBibb, BottomBunBibb } from '../ConstructorBibb/ConstructorBibb';
import { Filling } from '../Filling/Filling';
import { Preloader } from '../Preloader/Preloader';
import { useNavigate } from 'react-router-dom';
import { TFilling, TIngredient } from '../../types/types';
import { AnyAction } from 'redux';

export const BurgerConstructor = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isRequest, success: isOrderAccepted } = useSelector((store: any) => store.burger.orderData)
  const { isError, errorMessage } = useSelector((store: any) => store.burger.orderData.error)
  const { bun, fillings, burgerCost, ingredientIds } = useSelector((store: any) => store.burger);
  const { ingredients } = useSelector((store: any) => store.ingredients);
  const { isLoggedIn } = useSelector((store: any) => store.auth);

  const isBunBibb = bun.length === 0;
  const isFillingBibb = fillings.length === 0;
  const allowOrder = bun.length !== 0 || fillings.length !== 0 ? true : false

  const [, dropTarget] = useDrop({
    accept: 'ingredient',
    drop(itemId: { id: string }) {
      const item = ingredients.find((ingredient: TIngredient) => ingredient._id === itemId.id)
      dispatch(addIngredient(item))
    }
  })

  function handleButtonClick() {
    if (!isLoggedIn) {
      return navigate('/login')
    }
    dispatch(placeOrder(ingredientIds) as unknown as AnyAction)
  }

  function onCloseModal() {
    dispatch({ type: RESET_ORDER_DATA })
    dispatch({ type: RESET_BURGER })
  }

  function moveCard(dragIndex: number, hoverIndex: number) {
    dispatch({ type: MOVE_FILLINGS, payload: { dragIndex, hoverIndex } })
  }

  return (
    <>
      <section ref={dropTarget} className={styles.section}>
        {isBunBibb
          ?
          <TopBunBibb />
          :
          <div className={styles.container_bun}>
            <ConstructorElement type="top"
              isLocked={true}
              text={bun[0].name + ` (????????)`}
              price={bun[0].price}
              thumbnail={bun[0].image ? bun[0].image : null}
              key={'top'}
            />
          </div>}

        {isFillingBibb
          ?
          <FillingBibb />
          :
          <div
            className={`${styles.section_list} custom-scroll`}
          >
            {fillings.map((filling: TFilling, index: number) => {
              return (
                <Filling
                  key={filling.uuid}
                  index={index}
                  filling={filling}
                  moveCard={moveCard}
                />
              )
            }
            )}
          </div>
        }

        {isBunBibb
          ?
          <BottomBunBibb />
          :
          <div className={styles.container_bun}>
            <ConstructorElement
              type="bottom"
              isLocked={true}
              text={bun[0].name + ' (??????)'}
              price={bun[0].price}
              thumbnail={bun[0].image}
            />
          </div>
        }

        <div className={styles.container_price}>
          <p className="text text_type_digits-medium">
            {burgerCost}
            <CurrencyIcon type="primary" />
          </p>
          <Button
            type="primary"
            size="large"
            disabled={!allowOrder}
            onClick={handleButtonClick}>
            ???????????????? ??????????
          </Button>
        </div>
      </section>

      {isRequest &&
        <Modal title="" closeIcon={false}>
          <Preloader message="PROCESSING YOU ORDER..." />
        </Modal>}

      {isOrderAccepted &&
        <Modal title="" onClose={onCloseModal} closeIcon={true}>
          <OrderDetails />
        </Modal>}

      {isError &&
        <Modal title="" onClose={onCloseModal} closeIcon={false}>
          <Error errorMessage={errorMessage} />
        </Modal>
      }

    </>
  )
}
