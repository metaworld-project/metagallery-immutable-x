// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@imtbl/imx-contracts/contracts/Mintable.sol";


contract nftcontract is ERC721,Ownable,IMintable {
    
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _collectionIds;
    
    mapping (uint256 => string) public _tokenURIs;
    mapping (uint256 => string) public _tokenName;
    mapping (uint256 => uint256) public _collectionId;
    mapping (uint256 => string) public _collectionName;
    mapping (uint256 => address) public _collectionOwner;

    event MintNFT(uint256 tokenId, address recipient, string tokenURI,string name,uint256 collectionId_);
    event CreateCollection(uint256 collectionId,string collectionName,address collectionOwner);

    string private _baseURIextended;

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {}
    
    function mintFor(
        address to,
        uint256 quantity,
        bytes calldata mintingBlob
    ) external override {
        // TODO: make sure only Immutable X can call this function
        // TODO: mint the token!
    }


    function setBaseURI(string memory baseURI_) external onlyOwner {
        _baseURIextended = baseURI_;
    }

    function mintNFT(address recipient, string memory tokenURI,string memory name,uint256 collectionId_)
        public
        returns (uint256)
    {
        require (
            _collectionOwner[collectionId_] == msg.sender, 'not collection owner'
        );
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
       // mintWithTokenURI(recipient, newItemId, tokenURI);
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);
        _setName(newItemId,name);
        _collectionId[newItemId] = collectionId_; 
        emit MintNFT(newItemId,recipient,tokenURI,name,collectionId_);
        return newItemId;
    }
    



    function _setTokenURI(uint256 tokenId, string memory uri) internal {
        require(
            _exists(tokenId),
            'KIP17Metadata: URI set of nonexistent token'
        );
        _tokenURIs[tokenId] = uri;
    }

    function _setName(uint256 tokenId, string memory name) internal {
        require(
            _exists(tokenId),
            'KIP17Metadata: URI set of nonexistent token'
        );
        _tokenName[tokenId] = name;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseURIextended;
    }

    function createCollection(string memory collectionName_) public {
        _collectionIds.increment();
        uint256 newCollectionId = _collectionIds.current();
        _collectionName[newCollectionId] = collectionName_;
        _collectionOwner[newCollectionId] = msg.sender;
        emit CreateCollection(newCollectionId,collectionName_,msg.sender);
    }
}
