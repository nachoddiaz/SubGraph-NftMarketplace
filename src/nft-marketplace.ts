import { Address, BigInt } from "@graphprotocol/graph-ts"
import {
  ItemBought as  ItemBoughtEvent,
  ItemCanceled as ItemCanceledEvent,
  ItemListed as ItemListedEvent
} from "../generated/NftMarketplace/NftMarketplace"
import { ItemListed, ItemBought, ItemCanceled, ActiveItem } from "../generated/schema";

//When an itemBought event occurs, execute this function
export function handleItemBought(event: ItemBoughtEvent): void {

//We save the event (itemBough) via the object (ItemBough)
  let itemBought = ItemBought.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))
  let activeItem = ActiveItem.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))
  if(!itemBought){
    itemBought = new ItemBought(
      getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
      )
  }
  itemBought.buyer = event.params.buyer
  itemBought.nftAddress = event.params.nftAddress
  itemBought.tokenId = event.params.tokenId
  activeItem!.buyer = event.params.buyer


  itemBought.save()
  activeItem!.save()

}

export function handleItemCanceled(event: ItemCanceledEvent): void {
  let itemCanceled = ItemCanceled.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))
  let activeItem = ActiveItem.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))

  if(!itemCanceled){
    itemCanceled = new ItemCanceled(
      getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
      )
  }

  itemCanceled.seller = event.params.owner
  itemCanceled.nftAddress = event.params.nftAddress
  itemCanceled.tokenId = event.params.tokenId


  activeItem!.buyer= Address.fromString("0x000000000000000000000000000000000000dEaD")
  //Its the same as activeItem!.buyer= Address.fromString("0x000000000000000000000000000000000000dEaD")
  //If the buyer is that address, we know that the item has been canceled


  itemCanceled.save()
  activeItem!.save()


}

export function handleItemListed(event: ItemListedEvent): void {
  let itemListed = ItemListed.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))
  let activeItem = ActiveItem.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))
  if(!itemListed){
    itemListed = new ItemListed(
      getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
      )
  }
  //Beacuase when we list the item, it doesnt exist before
  if(!activeItem){
    activeItem = new ActiveItem(
      getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
      )
  }
  itemListed.seller = event.params.seller
  itemListed.nftAddress = event.params.nftAddress
  itemListed.tokenId = event.params.tokenId
  itemListed.price = event.params.price

  activeItem.seller = event.params.seller
  activeItem.nftAddress = event.params.nftAddress
  activeItem.tokenId = event.params.tokenId
  activeItem.price = event.params.price


  itemListed.save()
  activeItem.save()
}

//BigInt & Address come from thegraph and string come from TypeScipt
function getIdFromEventParams(tokenId: BigInt, nftAddress: Address): string{

    return tokenId.toHexString() + nftAddress.toHexString()

}
